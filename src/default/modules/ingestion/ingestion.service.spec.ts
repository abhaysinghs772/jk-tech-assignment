import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IngestionProcessEntity } from './entities/ingestion.entity';
import { DocumentEntity } from '../documents/entities/document.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { IngestionStatus } from '../../common/enums/ingestion.enum';
import { NotFoundException } from '@nestjs/common';

const mockDocument = {
  id: 'doc-id',
  path: '/files/doc.pdf',
} as DocumentEntity;

const mockUser = {
  id: 'user-id',
} as UserEntity;

const mockIngestion = {
  id: 'ingestion-id',
  document: mockDocument,
  triggeredBy: mockUser,
  status: IngestionStatus.PENDING,
  startedAt: new Date(),
  completedAt: null,
  logs: null,
} as IngestionProcessEntity;

describe('IngestionService', () => {
  let service: IngestionService;
  let ingestionRepo: Repository<IngestionProcessEntity>;
  let documentRepo: Repository<DocumentEntity>;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(IngestionProcessEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockIngestion),
            save: jest.fn().mockResolvedValue(mockIngestion),
            findOneBy: jest.fn(),
            find: jest.fn().mockResolvedValue([mockIngestion]),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(DocumentEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockDocument),
            findOneBy: jest.fn().mockResolvedValue(mockDocument),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    ingestionRepo = module.get(getRepositoryToken(IngestionProcessEntity));
    documentRepo = module.get(getRepositoryToken(DocumentEntity));
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIngestionProcess', () => {
    it('should create and return a new ingestion process', async () => {
      const result = await service.createIngestionProcess('doc-id', 'user-id');
      expect(result).toEqual(mockIngestion);
      expect(documentRepo.findOneBy).toHaveBeenCalledWith({ id: 'doc-id' });
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 'user-id' });
      expect(ingestionRepo.save).toHaveBeenCalled();
    });

    it('should throw if document is not found', async () => {
      jest.spyOn(documentRepo, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.createIngestionProcess('invalid-doc', 'user-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw if user is not found', async () => {
      jest.spyOn(userRepo, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.createIngestionProcess('doc-id', 'invalid-user')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateIngestionStatus', () => {
    it('should update status and return ingestion process', async () => {
      jest.spyOn(ingestionRepo, 'findOneBy').mockResolvedValueOnce(mockIngestion);
      const result = await service.updateIngestionStatus('ingestion-id', IngestionStatus.IN_PROGRESS, 'started');
      expect(result).toEqual(mockIngestion);
      expect(ingestionRepo.save).toHaveBeenCalledWith(expect.objectContaining({ status: IngestionStatus.IN_PROGRESS }));
    });

    it('should throw if process is not found', async () => {
      jest.spyOn(ingestionRepo, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.updateIngestionStatus('invalid-id', 'FAILED')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteIngestionProcess', () => {
    it('should delete the ingestion process', async () => {
      const result = await service.deleteIngestionProcess('ingestion-id');
      expect(result).toEqual({ message: 'Ingestion process deleted successfully' });
    });

    it('should throw if process not found', async () => {
      jest.spyOn(ingestionRepo, 'delete').mockResolvedValueOnce({ affected: 0 });
      await expect(service.deleteIngestionProcess('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
