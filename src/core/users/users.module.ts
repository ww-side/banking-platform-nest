import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from '~/core/accounts/accounts.module';

import { TokenService } from '~/shared/services/token.service';

import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AccountsModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [JwtService, TokenService, UsersService],
})
export class UsersModule {}
