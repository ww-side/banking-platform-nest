import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersModule } from '~/core/users/users.module';

import { TokenService } from '~/shared/services/token.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
