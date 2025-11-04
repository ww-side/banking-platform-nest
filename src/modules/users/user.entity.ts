import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '~/shared/entities/base.entity';

import { Account } from '../accounts/account.entity';

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
}
