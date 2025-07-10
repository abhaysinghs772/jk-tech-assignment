// src/auth/strategies/otp.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'otp') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const mobile = req.body.mobile;
    const otp = req.body.otp;

    if (!mobile || !otp) {
      throw new UnauthorizedException('Missing mobile or OTP');
    }

    const user = await this.authService.validateOtp(mobile, otp);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
