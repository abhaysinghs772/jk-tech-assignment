// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppConfigService } from 'src/default/config/config.service';
import { UserService } from 'src/default/user/user.service';
import { encryption } from 'src/default/common/constants/encryption.option';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoles } from '../common/enums/role.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { ROLE_PERMISSIONS } from '../common/constants/role-permissions';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: AppConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user; // Return the user if validation passes
  }

  async validateOtp(mobile: string, otp: string): Promise<any> {
    const user = await this.userService.findByMobile(mobile);
    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or OTP');
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid mobile number or OTP');
    }

    return user; // Return the user if validation passes
  }

  async generateTokens(
    user: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const permissions = ROLE_PERMISSIONS[user.roles] || [];
    const payload : AuthenticatedUser = {
      username: user.name,
      sub: user.id,
      roles: [ user.roles ],
      permissions: permissions
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('API_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('API_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Hash and store the refresh token
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      encryption.SALT_ROUNDS,
    );
    await this.userService.update(user.id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiry: new Date(
        Date.now() + 24 * 60 * 60 * 1000 * encryption.REFRESH_TOKEN_EXPIRY,
      ),
    });

    return { accessToken, refreshToken };
  }

  async register(registerUserBody: {
    name: string;
    email: string;
    password: string;
    userRole: UserRoles;
  }) {
    const { name, email, password, userRole } = registerUserBody;

    // Check if admin already exists
    const existingAdmin = await this.userService.findByEmail(email);

    if (existingAdmin) {
      throw new ConflictException('user with this email already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save admin
    const user = new UserEntity();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    user.roles = userRole;
    const registerUser = await this.userService.create(user);

    return registerUser;
  }

  // Generate JWT token and refresh token
  async login(loginUserBody: LoginUserDto) {
    const { email, password } = loginUserBody;

    // validate user
    const user = await this.validateUser(email, password);

    // return access_token and refresh_token
    return this.generateTokens(user);
  }

  async refreshTokens(
    jwtToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const jwtPayload = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('API_SECRET'),
        ignoreExpiration: true,
      });

      const refreshPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('API_REFRESH_SECRET'),
      });

      if (
        !jwtPayload ||
        !refreshPayload ||
        jwtPayload.sub !== refreshPayload.sub
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userService.findOne(refreshPayload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Validate the refresh token
      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // update refresh token
      const hashedRefreshToken = await bcrypt.hash(
        refreshToken,
        encryption.SALT_ROUNDS,
      );
      await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

      // Generate new tokens
      return this.generateTokens(user);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
