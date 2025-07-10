// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
// import { OtpAuthGuard } from './guards/otp-auth.guard';
import { NoCache } from 'src/default/cache/cache.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
// import { ApiKeySecretGuard } from './guards/secret-auth.guard';

@NoCache()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/admin')
  async registeradmin(@Body() body: RegisterAdminDto) {
    return this.authService.registerAdmin(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('refresh-token')
  async refreshToken(
    @Headers('authorization') authorization: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    const jwtToken = authorization?.replace('Bearer ', '');

    if (!jwtToken || !refreshToken) {
      throw new UnauthorizedException('Tokens are required');
    }

    return this.authService.refreshTokens(jwtToken, refreshToken);
  }
}
