import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngestionProcessEntity } from './entities/ingestion.entity';
import { DocumentEntity } from '../documents/entities/document.entity';
import { UserEntity } from '../user/entities/user.entity';
import { IngestionStatus } from '../../common/enums/ingestion.enum';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(IngestionProcessEntity)
    private readonly ingestionRepo: Repository<IngestionProcessEntity>,

    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getDocumentById(documentId: string): Promise<DocumentEntity | null> {
    return this.documentRepo.findOne({
      where: { id: documentId },
    });
  }

  async createIngestionProcess(documentId: string, userId: string): Promise<IngestionProcessEntity> {
    const document = await this.documentRepo.findOneBy({ id: documentId });
    if (!document) throw new NotFoundException('Document not found');

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const ingestion = this.ingestionRepo.create({
      document,
      triggeredBy: user,
      status: IngestionStatus.PENDING,
      startedAt: new Date(),
    });

    return await this.ingestionRepo.save(ingestion);
  }

  async updateIngestionStatus(
    ingestionProcessId: string,
    status: IngestionStatus | string,
    logs?: string,
  ): Promise<IngestionProcessEntity> {
    const ingestion = await this.ingestionRepo.findOneBy({ id: ingestionProcessId });
    if (!ingestion) throw new NotFoundException('Ingestion process not found');

    ingestion.status = status as IngestionStatus;
    ingestion.logs = logs ?? ingestion.logs;
    if (status === IngestionStatus.COMPLETED || status === IngestionStatus.FAILED) {
      ingestion.completedAt = new Date();
    }

    return await this.ingestionRepo.save(ingestion);
  }

  async findAllIngestionProcesses(): Promise<IngestionProcessEntity[]> {
    return this.ingestionRepo.find({
      relations: ['document', 'triggeredBy'],
      order: { startedAt: 'DESC' },
    });
  }

  async findUserIngestionProcesses(userId: string): Promise<IngestionProcessEntity[]> {
    return this.ingestionRepo.find({
      where: {
        triggeredBy: { id: userId },
      },
      relations: ['document', 'triggeredBy'],
      order: { startedAt: 'DESC' },
    });
  }

  async findIngestionProcessById(id: string): Promise<IngestionProcessEntity | null> {
    return this.ingestionRepo.findOne({
      where: { id },
      relations: ['document', 'triggeredBy'],
    });
  }

  async deleteIngestionProcess(id: string): Promise<{ message: string }> {
    const result = await this.ingestionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ingestion process not found');
    }
    return { message: 'Ingestion process deleted successfully' };
  }
}