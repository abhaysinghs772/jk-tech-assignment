import { Module, OnModuleInit } from '@nestjs/common';
import { SwaggerService } from './swagger.service';
import { ConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [SwaggerService, AppConfigService],
  exports: [SwaggerService],
})
export class SwaggerModule implements OnModuleInit {
  constructor(private readonly swaggerService: SwaggerService) {}

  onModuleInit() {
    this.swaggerService.setupSwagger();
  }
}
