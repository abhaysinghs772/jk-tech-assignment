import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IdempotencyModule } from '../../idempotency/idempotency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], 'sqlDbConnection'),
    IdempotencyModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
