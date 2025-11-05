import { Column, Entity, ManyToOne } from 'typeorm';

import { User } from '~/modules/users/user.entity';

import { BaseEntity } from '~/shared/entities/base.entity';

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
}
