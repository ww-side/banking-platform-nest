import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '~/modules/users/user.entity';

import { Account } from './account.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async initAccounts(user: User) {
    const accounts = [
      this.accountRepository.create({
        user,
        currency: 'USD',
        balance: '1000.00',
      }),
      this.accountRepository.create({
        user,
        currency: 'EUR',
        balance: '500.00',
      }),
    ];

    return this.accountRepository.save(accounts);
  }

  async findByUser(userId: string) {
    const accounts = await this.accountRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return accounts.map((account) => ({
      id: account.id,
      currency: account.currency,
      balance: account.balance,
    }));
  }

  async findOne(id: string, userId: string) {
    const account = await this.accountRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException(`Account with ID "${id}" not found`);
    }

    return {
      id: account.id,
      currency: account.currency,
      balance: account.balance,
    };
  }
}
