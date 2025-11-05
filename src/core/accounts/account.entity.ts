import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

import { User } from '~/core/users/user.entity';

import { LedgerEntry } from '~/modules/ledger-entry/ledger-entry.entity';

import { BaseEntity } from '~/shared/entities/base.entity';

@Entity('accounts')
@Unique(['user', 'currency'])
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: string;

  @OneToMany(() => LedgerEntry, (entry) => entry.account)
  ledgerEntries: LedgerEntry[];
}
