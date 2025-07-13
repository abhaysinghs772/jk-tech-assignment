import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { IdempotencyModule } from '../idempotency/idempotency.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity], 'sqlDbConnection'),
    IdempotencyModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
