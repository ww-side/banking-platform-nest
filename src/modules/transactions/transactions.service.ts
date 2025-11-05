import { DataSource, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/account.entity';
import { ExchangeDTO, TransferDTO } from './dto';
import { ExchangeRateService } from './exchange-rate.service';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async transfer({
    amount,
    currency,
    fromUserId,
    toUserId,
    description,
  }: TransferDTO & { fromUserId: string }) {
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot transfer to the same user');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    return this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOne(Account, {
        where: { user: { id: fromUserId }, currency },
        relations: ['user'],
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await manager.findOne(Account, {
        where: { user: { id: toUserId }, currency },
        relations: ['user'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('Account not found for one of the users');
      }

      const fromBalance = Number(fromAccount.balance);
      if (fromBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const newFromBalance = (fromBalance - amount).toFixed(2);
      const newToBalance = (Number(toAccount.balance) + amount).toFixed(2);

      fromAccount.balance = newFromBalance;
      toAccount.balance = newToBalance;

      await manager.save([fromAccount, toAccount]);

      const senderTx = manager.create(Transaction, {
        user: fromAccount.user,
        type: 'transfer',
        description: description || `Transfer to user ${toAccount.user.id}`,
        totalAmount: (-amount).toFixed(2),
        currency,
      });

      const receiverTx = manager.create(Transaction, {
        user: toAccount.user,
        type: 'transfer',
        description: description || `Transfer from user ${fromAccount.user.id}`,
        totalAmount: amount.toFixed(2),
        currency,
      });

      await manager.save([senderTx, receiverTx]);

      return senderTx;
    });
  }

  async exchange({
    userId,
    fromCurrency,
    toCurrency,
    amount,
  }: ExchangeDTO & { userId: string }) {
    if (fromCurrency === toCurrency) {
      throw new BadRequestException('Currencies must be different');
    }

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const rate = this.exchangeRateService.getRate(fromCurrency, toCurrency);

    return this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOne(Account, {
        where: { user: { id: userId }, currency: fromCurrency },
        relations: ['user'],
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await manager.findOne(Account, {
        where: { user: { id: userId }, currency: toCurrency },
        relations: ['user'],
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException(
          'Account not found for one of the currencies',
        );
      }

      const fromBalance = Number(fromAccount.balance);
      if (fromBalance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      const convertedAmount = (amount * rate).toFixed(2);

      fromAccount.balance = (fromBalance - amount).toFixed(2);
      toAccount.balance = (
        Number(toAccount.balance) + Number(convertedAmount)
      ).toFixed(2);

      await manager.save([fromAccount, toAccount]);

      const tx = manager.create(Transaction, {
        user: fromAccount.user,
        type: 'exchange',
        description: `Exchange ${amount} ${fromCurrency} → ${convertedAmount} ${toCurrency}`,
        totalAmount: convertedAmount,
        currency: toCurrency,
      });

      return manager.save(tx);
    });
  }

  async getTransactions({
    userId,
    type,
    page,
    limit,
  }: {
    userId: string;
    type?: 'transfer' | 'exchange';
    page: number;
    limit: number;
  }) {
    const qb = this.transactionsRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('user.id = :userId', { userId });

    if (type) {
      qb.andWhere('transaction.type = :type', { type });
    }

    qb.orderBy('transaction.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
