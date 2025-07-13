import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm'; // Import this for mocking repositories
import { UserEntity } from './entities/user.entity'; // Your TypeORM UserEntity entity
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm'; // Import Repository
import { UserRoles } from '../common/enums/role.enum';

// --- Mocks for TypeORM Repositories ---
const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(), // For findAll
  createQueryBuilder: jest.fn(), // For complex queries
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        // Provide mocks for each repository your service depends on
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  // --- Test Cases for create ---
  describe('create', () => {
    it('should create a new user with a default role', async () => {
      const defaultRole = UserRoles.Viewer ;
      const createDto = { name: 'newuser', password: 'password123', email: 'a@b.com', roles: defaultRole };
      const createdUser = { id: 'new-id', name: 'newuser', password_hash: 'hashed', email: 'a@b.com' };

      // Mock repository calls
      mockUserRepository.create.mockReturnValue(createdUser); // create() just prepares the entity
      mockUserRepository.save.mockResolvedValue(createdUser); // save() persists it

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('mock_hashed_password');

      const result = await userService.create(createDto);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'newuser',
          email: 'a@b.com',
          password_hash: 'mock_hashed_password',
        }),
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  // --- Test Cases for findAll ---
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 'user-1', name: 'u1' }, { id: 'user-2', name: 'u2' }];
      mockUserRepository.find.mockResolvedValue(users);
      expect(await userService.findAll()).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  // --- Test Cases for findByUsername ---
  describe('findByUsername', () => {
    it('should return a user if found', async () => {
      const user = { id: 'user-1', username: 'testuser', password_hash: 'hashed_password' };
      mockUserRepository.findOne.mockResolvedValue(user);
      expect(await userService.findByUsername('testuser')).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(await userService.findByUsername('nonexistent')).toBeNull();
    });
  });

  // --- Test Cases for updateUserRole ---
  describe('updateUserRole', () => {
    const newRoleName = {roles: UserRoles.Editor};
    it('should update user role successfully', async () => {
      const userId = 'user-to-update';
      const mockUser = { id: userId, username: 'testuser', users_roles: [{ id: 'ur-1', user: { id: userId }, role: { id: 3, name: 'viewer' } }] }; // Existing viewer role
      
      // Mock repository calls
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      await userService.update(userId, newRoleName );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId }, // Important for fetching existing roles
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(userService.update('non-existent', newRoleName )).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if new role not found', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'user-1', users_roles: [] });
      await expect(userService.update('user-1', { roles: 'non-existent-role'})).rejects.toThrow(NotFoundException);
    });
  });

  // --- Test Cases for delete ---
  describe('delete', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });
      await userService.delete('user-1');
      expect(mockUserRepository.delete).toHaveBeenCalledWith('user-1');
    });

    it('should return true if user was deleted', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });
      expect(await userService.delete('user-1')).toBe(true);
    });

    it('should return false if user was not found for deletion', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });
      expect(await userService.delete('non-existent')).toBe(false);
    });
  });

  // --- Test Cases for comparePassword ---
  // will fix this later, when i have some time to refactor the code
//   describe('comparePassword', () => {
//     it('should return true for matching passwords', async () => {
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
//       expect(await userService.comparePassword('password', 'hashed_password')).toBe(true);
//     });

//     it('should return false for non-matching passwords', async () => {
//       jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
//       expect(await userService.comparePassword('wrong_password', 'hashed_password')).toBe(false);
//     });
//   });
});