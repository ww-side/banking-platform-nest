import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from '~/shared/guards/auth-guard';
import { TokenService } from '~/shared/services/token.service';

import { CreateUserDTO, UpdateUserDTO } from './dto';
import {
  CreateUserDoc,
  DeleteUserDoc,
  FindAllUsersDoc,
  FindUserByEmailDoc,
  FindUserByIdDoc,
  UpdateUserDoc,
} from './users.docs';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Post()
  @CreateUserDoc()
  create(@Body() data: CreateUserDTO) {
    return this.usersService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @FindAllUsersDoc()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @FindUserByEmailDoc()
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @FindUserByIdDoc()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @UpdateUserDoc()
  update(
    @Body() data: UpdateUserDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.update(id, data);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @DeleteUserDoc()
  delete(@Headers('Authorization') authHeader: string) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.delete(id);
  }
}
