import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeySecretStrategy extends PassportStrategy(
  Strategy,
  'api-key-secret',
) {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const apiKey = req.headers['x-api-key'] as string;
    const apiSecret = req.headers['x-api-secret'] as string;

    if (!apiKey || !apiSecret) {
      throw new UnauthorizedException('API Key and API Secret are required');
    }

    // Validate API Secret from environment variable
    const validSecret = this.configService.get('API_SECRET');
    if (apiSecret !== validSecret) {
      throw new UnauthorizedException('Invalid API Secret');
    }

    // Pass the API Key for further processing (e.g., database validation)
    return { apiKey };
  }
}
