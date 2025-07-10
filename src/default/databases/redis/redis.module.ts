import { Module, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis.service';
import { redisConfig } from './redis.config';
import { AppConfigService } from 'src/default/config/config.service';
import { ConfigModule } from 'src/default/config/config.module';
import { ConsoleLogger } from 'src/default/logger/console/console.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisService,
      useFactory: (configService: AppConfigService) =>
        new RedisService(redisConfig(configService)),
      inject: [AppConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule implements OnModuleInit {
  async onModuleInit() {
    ConsoleLogger.log(
      'Redis Module: Connection established successfully!',
      'RedisModule',
    );
  }
}
