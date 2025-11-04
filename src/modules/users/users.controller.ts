import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TokenService } from '~/shared/services/token.service';

import { CreateUserDTO, UpdateUserDTO } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Post()
  create(@Body() data: CreateUserDTO) {
    return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(
    @Body() data: UpdateUserDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.update(id, data);
  }

  @Delete()
  delete(@Headers('Authorization') authHeader: string) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.delete(id);
  }
}
