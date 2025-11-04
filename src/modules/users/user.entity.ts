import { Column, Entity } from 'typeorm';

import { BaseEntity } from '~/shared/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;
}
