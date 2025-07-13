import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { DocumentService } from './document.service';

import { diskStorage } from 'multer';
import { extname } from 'path';
import { Permissions } from '../common/decorators/permissions.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
// import { FileSizeValidationPipe } from "./pipes/fileupload.pipe"; // can use this also

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
  @Permissions('create:document', 'upload:document') // Both required for creating with upload
  @UseInterceptors(FileInterceptor('file', { storage: documentStorage }))
  async createDocument(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1000 }),
          new FileTypeValidator({ fileType: 'text/csv' }),
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
}
