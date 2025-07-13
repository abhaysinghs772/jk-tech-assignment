import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity, 'sqlDbConnection')
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserBody: CreateUserDto): Promise<UserEntity> {
    const { email, name, password, roles } = createUserBody;

    // Check if admin already exists
    const userExist = await this.findByEmail(email);

    if (userExist) {
      throw new ConflictException('user with this email already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserEntity();
    user.email = email;
    user.name = name;
    user.password = hashedPassword;
    user.roles = roles;

    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({});
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ name: username });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByMobile(mobile: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ mobile });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpExpiredRefreshTokens(): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({ refreshToken: null, refreshTokenExpiry: null })
      .where('refreshTokenExpiry < :now', { now: new Date() })
      .execute();
  }
}
