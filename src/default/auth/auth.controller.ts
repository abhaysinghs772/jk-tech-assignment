// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { NoCache } from 'src/default/cache/cache.decorator';
import { RegisterUserDto } from './dto/register-user.dto';

@NoCache()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { name, email, password, user_role: userRole } = body;
    const registerUserBody = { name, email, password, userRole };

    return this.authService.register(registerUserBody);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
