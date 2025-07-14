import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { DocumentService } from './document.service';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { Permission } from '../../common/enums/permission.enum';
import { FileSizeValidationPipe } from "./pipes/fileupload.pipe";
import { NoCache } from 'src/default/cache/cache.decorator';
import { IdempotencyInterceptor } from 'src/default/common/interceptors/idempotency.interceptor';

// Define storage for multer (for file uploads)
const documentStorage = diskStorage({
  destination: './uploads/documents',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extname(file.originalname)}`);
  },
});

@Controller('document')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Permissions(
    Permission.CreateDocument, 
    Permission.UploadDocument
    )
  @UseInterceptors(
    IdempotencyInterceptor, 
    FileInterceptor('file', { storage: documentStorage })
  )
  async createDocument(
    @UploadedFile(
      new FileSizeValidationPipe(),
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('title') title: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    if (!file) {
      throw new Error('File is required');
    }
    const documentData = {
      title,
      filePath: file.path,
      uploadedBy: req.user.sub,
    };
    return this.documentService.create(documentData);
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Get()
  @Permissions(Permission.ReadAnyDocument)
  findAllDocuments() {
    return this.documentService.findAll();
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Get(':id')
  @Permissions(Permission.ReadAnyDocument)
  async findOneDocument(@Param('id') id: string) {
    const document = await this.documentService.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Put(':id')
  @Permissions(
      Permission.UpdateAnyDocument, 
      Permission.UpdateOwnDocument
  )
  async updateDocument(
      @Param('id') id: string,
      @Body() updateDocumentDto: any, // will modify this in future, but i am running out of time
      @Req() req: { user: AuthenticatedUser },
  ) {
      const document = await this.documentService.findById(id);
      if (!document) {
      throw new NotFoundException('Document not found');
      }

      const user = req.user;
      const userId = user.sub;

      // Admin (or anyone with update:any_document) can update any document      
      if (user.permissions.includes(Permission.UpdateAnyDocument)) {
          return this.documentService.update(id, updateDocumentDto);
      }

      // Editor (or anyone with update:own_document) can only update their own
      if (user.permissions.includes(Permission.UpdateOwnDocument) && document.uploaded_by.id === userId) {
          return this.documentService.update(id, updateDocumentDto);
      }

      throw new ForbiddenException('You are not authorized to update this document.');
  }

  @Delete(':id')
  @UseInterceptors(IdempotencyInterceptor)
  @Permissions(
      Permission.DeleteAnyDocument, 
      Permission.DeleteOwnDocument
  )
  async deleteDocument(@Param('id') id: string, @Req() req: { user: AuthenticatedUser }) {
      const document = await this.documentService.findById(id);
      if (!document) {
      throw new NotFoundException('Document not found');
      }

      const user = req.user;
      const UserId = user.sub;

      // Admin (or anyone with delete:any_document) can delete any document
      if (user.permissions.includes(Permission.DeleteAnyDocument)) {
          return this.documentService.delete(id);
      }

      // Editor (or anyone with delete:own_document) can only delete their own
      if (user.permissions.includes(Permission.DeleteOwnDocument) && document.uploaded_by.id === UserId ) {
          return this.documentService.delete(id);
      }

      throw new ForbiddenException('You are not authorized to delete this document.');
  }
}
