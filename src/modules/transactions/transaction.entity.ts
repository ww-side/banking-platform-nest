import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { User } from '~/core/users/user.entity';

import { BaseEntity } from '~/shared/entities/base.entity';

import { LedgerEntry } from '../ledger-entry/ledger-entry.entity';

export type TransactionType = 'transfer' | 'exchange';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: ['transfer', 'exchange'] })
  type: TransactionType;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  totalAmount: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @OneToMany(() => LedgerEntry, (entry) => entry.transaction, {
    cascade: true,
  })
  ledgerEntries: LedgerEntry[];
}
