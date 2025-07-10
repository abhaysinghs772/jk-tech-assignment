// src/config/app-config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  // Get the application port
  getPort(): number {
    return this.configService.get('PORT', 8002);
  }

  // Add other required configuration methods here
  get(key: string): any {
    return this.configService.get(key);
  }
}
