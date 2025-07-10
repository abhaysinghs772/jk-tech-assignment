import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyKeyEntity } from './idempotency-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../databases/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IdempotencyKeyEntity], 'sqlDbConnection'),
    RedisModule, // Import RedisModule to use RedisService
  ],
  providers: [IdempotencyService],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}
