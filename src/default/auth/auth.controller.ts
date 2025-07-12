// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NoCache } from 'src/default/cache/cache.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@NoCache()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { name, email, password, user_role: userRole } = body;
    const registerUserBody = { name, email, password, userRole };

    return this.authService.register(registerUserBody);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
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
