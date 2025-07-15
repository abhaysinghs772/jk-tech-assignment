import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentEntity } from './entities/document.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 'user-id',
  name: 'Test User',
};

const mockDocument = {
  id: 'doc-id',
  title: 'Test Document',
  path: '/files/test.pdf',
  uploaded_by: mockUser,
} as DocumentEntity;

describe('DocumentService', () => {
  let service: DocumentService;
  let docRepo: Repository<DocumentEntity>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(DocumentEntity, 'sqlDbConnection'),
          useValue: {
            save: jest.fn().mockResolvedValue(mockDocument),
            findOne: jest.fn().mockResolvedValue(mockDocument),
            find: jest.fn().mockResolvedValue([mockDocument]),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    docRepo = module.get<Repository<DocumentEntity>>(getRepositoryToken(DocumentEntity, 'sqlDbConnection'));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a document', async () => {
      const result = await service.create({
        title: 'Test Document',
        filePath: '/files/test.pdf',
        uploadedBy: 'user-id',
      });

      expect(userService.findOne).toHaveBeenCalledWith('user-id');
      expect(docRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.create({
          title: 'Invalid Doc',
          filePath: '/invalid/path',
          uploadedBy: 'invalid-user-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const findSpy = jest.spyOn(docRepo, 'find').mockResolvedValueOnce([mockDocument]);
      const result = await service.findAll();
      expect(findSpy).toHaveBeenCalled();
      expect(result).toEqual([mockDocument]);
    });
  });

  describe('findById', () => {
    it('should return a document by ID', async () => {
      const result = await service.findById('doc-id');
      expect(docRepo.findOne).toHaveBeenCalledWith({ where: { id: 'doc-id' } });
      expect(result).toEqual(mockDocument);
    });
  });

  describe('update', () => {
    it('should update the document', async () => {
      const result = await service.update('doc-id', { title: 'Updated Title' });
      expect(docRepo.update).toHaveBeenCalledWith('doc-id', { title: 'Updated Title' });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('delete', () => {
    it('should delete the document', async () => {
      const result = await service.delete('doc-id');
      expect(docRepo.delete).toHaveBeenCalledWith('doc-id');
      expect(result).toEqual({ affected: 1 });
    });
  });
});
