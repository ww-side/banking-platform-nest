import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenService } from '~/shared/services/token.service';

import { ExchangeRateService } from './exchange-rate.service';
import { Transaction } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TokenService,
    JwtService,
    ExchangeRateService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
