import { DataSource, EntityManager, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/account.entity';
import { Transaction } from '../transactions/transaction.entity';
import { LedgerEntry } from './ledger-entry.entity';

@Injectable()
export class LedgerEntryService {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerRepo: Repository<LedgerEntry>,
    private readonly dataSource: DataSource,
  ) {}

  async createDoubleEntry({
    amount,
    currency,
    fromAccount,
    manager,
    toAccount,
    transaction,
  }: {
    manager: EntityManager;
    transaction: Transaction;
    fromAccount: Account;
    toAccount: Account;
    amount: number;
    currency: string;
  }) {
    const debit = manager.create(LedgerEntry, {
      transaction,
      account: fromAccount,
      amount: (-amount).toFixed(2),
      currency,
      direction: 'debit',
    });

    const credit = manager.create(LedgerEntry, {
      transaction,
      account: toAccount,
      amount: amount.toFixed(2),
      currency,
      direction: 'credit',
    });

    await manager.save([debit, credit]);
    return [debit, credit];
  }

  async createExchangeEntries({
    manager,
    transaction,
    fromAccount,
    toAccount,
    fromAmount,
    toAmount,
    fromCurrency,
    toCurrency,
  }: {
    manager: EntityManager;
    transaction: Transaction;
    fromAccount: Account;
    toAccount: Account;
    fromAmount: number;
    toAmount: number;
    fromCurrency: string;
    toCurrency: string;
  }) {
    const debit = manager.create(LedgerEntry, {
      transaction,
      account: fromAccount,
      amount: (-fromAmount).toFixed(2),
      currency: fromCurrency,
      direction: 'debit',
    });

    const credit = manager.create(LedgerEntry, {
      transaction,
      account: toAccount,
      amount: toAmount.toFixed(2),
      currency: toCurrency,
      direction: 'credit',
    });

    await manager.save([debit, credit]);
    return [debit, credit];
  }
}
