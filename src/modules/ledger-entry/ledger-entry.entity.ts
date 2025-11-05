import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '~/shared/entities/base.entity';

import { Account } from '../accounts/account.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('ledger')
export class LedgerEntry extends BaseEntity {
  @ManyToOne(() => Transaction, (tx) => tx.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  transaction: Transaction;

  @ManyToOne(() => Account, (account) => account.ledgerEntries, {
    onDelete: 'CASCADE',
  })
  account: Account;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column()
  direction: 'debit' | 'credit';
}
