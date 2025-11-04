import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '~/shared/entities/base.entity';

import { User } from '../users/user.entity';

@Entity('accounts')
@Unique(['user', 'currency'])
export class Account extends BaseEntity {
  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: string;
}
