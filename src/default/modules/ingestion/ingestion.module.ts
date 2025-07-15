import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from '../documents/entities/document.entity';
import { IdempotencyModule } from '../../idempotency/idempotency.module';
import { DocumentService } from '../documents/document.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionProcessEntity } from './entities/ingestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ 
        UserEntity, 
        DocumentEntity,
        IngestionProcessEntity,
    ], 'sqlDbConnection'),
    IdempotencyModule,
  ],
  controllers: [IngestionController],
  providers: [UserService, DocumentService, IngestionService],
  exports: [UserService, DocumentService, IngestionService],
})
export class IngestionModule {}
