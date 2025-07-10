// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OtpStrategy } from './strategies/otp.strategy';
import { UserModule } from 'src/default/user/user.module';
import { ApiKeySecretStrategy } from './strategies/secret.strategy';
import { AppConfigService } from 'src/default/config/config.service';
import { ConfigModule } from 'src/default/config/config.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.get('API_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    OtpStrategy,
    ApiKeySecretStrategy,
  ],
})
export class AuthModule {}
