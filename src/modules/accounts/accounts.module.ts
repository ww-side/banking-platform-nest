import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenService } from '~/shared/services/token.service';

import { Account } from './account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService, JwtService, TokenService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
