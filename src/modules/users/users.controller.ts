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
  @FindAllUsersDoc()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('email/:email')
  @FindUserByEmailDoc()
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  @FindUserByIdDoc()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UpdateUserDoc()
  update(
    @Body() data: UpdateUserDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.update(id, data);
  }

  @Delete()
  @DeleteUserDoc()
  delete(@Headers('Authorization') authHeader: string) {
    const id = this.tokenService.extractUserId(authHeader);
    return this.usersService.delete(id);
  }
}
