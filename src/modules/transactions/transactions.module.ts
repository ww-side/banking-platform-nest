import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LedgerEntry } from '~/modules/ledger-entry/ledger-entry.entity';
import { LedgerEntryService } from '~/modules/ledger-entry/ledger-entry.service';
import { ExchangeRateService } from '~/modules/transactions/exchange-rate.service';
import { Transaction } from '~/modules/transactions/transaction.entity';
import { TransactionsController } from '~/modules/transactions/transactions.controller';
import { TransactionsService } from '~/modules/transactions/transactions.service';

import { TokenService } from '~/shared/services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, LedgerEntry])],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TokenService,
    JwtService,
    ExchangeRateService,
    LedgerEntryService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
