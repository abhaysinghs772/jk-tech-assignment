import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { IngestionService } from './ingestion.service'; // Your ingestion service
import { HttpService } from '@nestjs/axios'; // For microservice communication
import { firstValueFrom } from 'rxjs';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class IngestionController {
  constructor(
    private readonly ingestionService: IngestionService,
    private readonly httpService: HttpService, // For Python backend communication
  ) {}

  // API to trigger ingestion, possibly via webhook/API call to Python backend
  @Post('trigger/:documentId')
  @HttpCode(HttpStatus.ACCEPTED) // Indicate that the request has been accepted for processing
  @Permissions('trigger:ingestion')
  async triggerIngestion(
    @Param('documentId') documentId: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    // 1. Validate document existence
    const document = await this.ingestionService.getDocumentById(documentId); // Assuming a method in IngestionService
    if (!document) {
      throw new NotFoundException('Document not found for ingestion.');
    }

    // 2. Record ingestion request in your database
    const ingestionProcess = await this.ingestionService.createIngestionProcess(
      documentId,
      req.user.id,
    );

    // 3. Trigger Python backend (microservice communication)
    try {
      const pythonBackendUrl = process.env.PYTHON_INGESTION_SERVICE_URL; // From config
      // Example: Using Axios to send a request to the Python microservice
      await firstValueFrom(
        this.httpService.post(`${pythonBackendUrl}/ingest`, {
          documentId: document.id,
          filePath: document.filePath,
          ingestionProcessId: ingestionProcess.id, // Pass NestJS process ID for status updates
        }),
      );
      // Update ingestion status to IN_PROGRESS or similar
      await this.ingestionService.updateIngestionStatus(ingestionProcess.id, 'IN_PROGRESS');
      return { message: 'Ingestion triggered successfully', processId: ingestionProcess.id };
    } catch (error) {
      console.error('Error triggering Python backend:', error);
      // Update ingestion status to FAILED if triggering fails
      await this.ingestionService.updateIngestionStatus(ingestionProcess.id, 'FAILED', error.message);
      throw new Error('Failed to trigger ingestion process. Please try again.');
    }
  }

  @Get('status')
  @Permissions('view:ingestion_status')
  findAllIngestionProcesses(@Req() req: { user: AuthenticatedUser }) {
    // Admins can see all, Editors might only see their own triggered processes
    if (req.user.permissions.includes('manage:ingestion_processes')) { // Admin
      return this.ingestionService.findAllIngestionProcesses();
    } else { // Editors/Viewers with 'view:ingestion_status' might only see their own
      return this.ingestionService.findUserIngestionProcesses(req.user.id);
    }
  }

  @Get('status/:id')
  @Permissions('view:ingestion_status')
  async getIngestionProcessStatus(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
    const process = await this.ingestionService.findIngestionProcessById(id);
    if (!process) {
      throw new NotFoundException('Ingestion process not found.');
    }

    // Ensure users can only view processes they are authorized for
    if (!req.user.permissions.includes('manage:ingestion_processes') && process.triggeredBy !== req.user.id) {
      throw new ForbiddenException('You are not authorized to view this ingestion process status.');
    }

    return process;
  }

  @Post('webhook/update-status') // This endpoint would be called by the Python backend
  @HttpCode(HttpStatus.NO_CONTENT) // Webhooks often expect a 204 No Content
  // This endpoint might have a specific API key/secret guard rather than JWTAuthGuard
  // For simplicity, let's assume it's protected by a secret or internal mechanism
  async handleIngestionWebhook(@Body() webhookData: {
    ingestionProcessId: string;
    status: string; // e.g., 'COMPLETED', 'FAILED'
    details?: string;
  }) {
    // Add a specific guard for webhooks (e.g., check API key in header)
    // @UseGuards(WebhookAuthGuard)
    // ...
    await this.ingestionService.updateIngestionStatus(
      webhookData.ingestionProcessId,
      webhookData.status,
      webhookData.details,
    );
  }

  @Delete(':id')
  @Permissions('manage:ingestion_processes') // Only Admin can manage (e.g., cancel/delete records)
  async deleteIngestionProcess(@Param('id') id: string) {
    return this.ingestionService.deleteIngestionProcess(id);
  }
}