import { Column, Entity, OneToMany } from 'typeorm';

import { Account } from '~/core/accounts/account.entity';
import { Transaction } from '~/modules/transactions/transaction.entity';

import { BaseEntity } from '~/shared/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions: Transaction[];
}
