import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Param,
  // Patch,
  // Delete,
  // NotFoundException,
  // ParseUUIDPipe,
  // UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { JwtAuthGuard } from 'src/default/auth/guards/jwt-auth.guard';
// import { NoCache } from 'src/default/cache/cache.decorator';
// import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*
  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Post()
  async create(@Body() user: Partial<CreateUserDto>): Promise<UpdateUserDto> {
    return this.userService.create(user);
  }

  @Get()
  async findAll(): Promise<UpdateUserDto[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UpdateUserDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() userDto: Partial<UpdateUserDto>,
  ): Promise<UpdateUserDto> {
    return this.userService.update(id, userDto);
  }

  @NoCache()
  @UseInterceptors(IdempotencyInterceptor)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }
  */
}
