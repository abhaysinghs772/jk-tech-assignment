import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from './default/config/config.module';
import { SqlDbModule } from './default/databases/sql/sqldb.module';
import { RedisModule } from './default/databases/redis/redis.module';
import { AppController } from './app.controller';
import { AppCacheModule } from './default/cache/cache.module';
import { SwaggerModule } from './default/swagger/swagger.module';
import { HttpModule } from '@nestjs/axios';
import { ErrorHandlingModule } from './default/error/error.module';
import { NotFoundMiddleware } from './default/common/middleware/not-found.middleware';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuthModule } from './default/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UnifiedResponseInterceptor } from './default/common/interceptors/unified-response.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigService } from './default/config/config.service';
import { LoggerModule } from './default/logger/console/console.module';
import { CloudwatchModule } from './default/logger/cloudwatch/cloudwatch.module';
import { JourneyIdInterceptor } from './default/common/interceptors/journey-id/journey-id-add.interceptor';
import { RemoveJourneyIdInterceptor } from './default/common/interceptors/journey-id/journey-id-remove.interceptor';
import { IdempotencyModule } from './default/idempotency/idempotency.module';
import { UserModule } from './default/modules/user/user.module';
import { DocumentModule } from './default/modules/documents/document.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule,
    LoggerModule,
    SqlDbModule,
    RedisModule,
    AppCacheModule,
    SwaggerModule,
    HttpModule,
    UserModule,
    AuthModule,
    ErrorHandlingModule,
    CloudwatchModule,
    IdempotencyModule,
    DocumentModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JourneyIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UnifiedResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RemoveJourneyIdInterceptor,
    },
    AppConfigService,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NotFoundMiddleware)
      .exclude({ path: '/api/v1/users', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
