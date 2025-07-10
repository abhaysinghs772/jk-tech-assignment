import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './default/config/config.service';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AppController } from './app.controller';
import { SwaggerService } from './default/swagger/swagger.service';
import { ConsoleLogger } from './default/logger/console/console.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get(AppConfigService);
  const port = appConfigService.getPort();
  const globalPrefix = `api/v${appConfigService.get('API_VERSION')}`;
  const appController = app.get(AppController);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable api versioning with a prefix
  app.setGlobalPrefix(globalPrefix);

  // Initialize ConsoleLogger
  const eventEmitter = app.get(EventEmitter2);
  ConsoleLogger.initialize(eventEmitter);
  ConsoleLogger.log('Application initialized', 'Bootstrap');

  // swagger service
  const swaggerService = app.get(SwaggerService);
  swaggerService.initialize(app);
  swaggerService.setupSwagger();

  // Start the application
  await app
    .listen(port)
    .then(() => {
      const baseUrl = `http://localhost:${port}/${globalPrefix}`;
      ConsoleLogger.log(`Application is running on: ${baseUrl}`, 'Bootstrap');
      ConsoleLogger.log(
        `Health Check Endpoint: ${baseUrl}/health`,
        'Bootstrap',
      );
      ConsoleLogger.log('Initiating Launch Time Health Check', 'Bootstrap');
      appController
        .checkHealthService()
        .then((response) => {
          ConsoleLogger.log(response, 'Bootstrap');
        })
        .catch((error) => {
          ConsoleLogger.error('Health Check Error', error, 'Bootstrap');
        });
    })
    .catch((error) => {
      ConsoleLogger.error('Failed to start the application', error);
    });
}

bootstrap();
