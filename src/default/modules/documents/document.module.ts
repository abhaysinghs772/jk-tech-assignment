import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { IdempotencyModule } from '../../idempotency/idempotency.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DocumentEntity], 'sqlDbConnection'),
    IdempotencyModule,
  ],
  controllers: [DocumentController],
  providers: [UserService, DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
