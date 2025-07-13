import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/default/auth/guards/jwt-auth.guard';
import { NoCache } from 'src/default/cache/cache.decorator';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../common/decorators/permissions.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permissions('manage:users')
  async findAll(): Promise<any[]> {
    return this.userService.findAll();
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Post()
  @Permissions('manage:users')
  async create(@Body() user: CreateUserDto): Promise<UpdateUserDto> {
    return this.userService.create(user);
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Patch(':id')
  @Permissions('manage:users')
  async updateUserRole(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return this.userService.update(id, userDto);
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Delete(':id')
  @Permissions('manage:users')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
