import { DataSource, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '../accounts/account.entity';
import { LedgerEntryService } from '../ledger-entry/ledger-entry.service';
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
    private readonly ledgerEntryService: LedgerEntryService,
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

      if (Number(fromAccount.balance) < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      fromAccount.balance = (Number(fromAccount.balance) - amount).toFixed(2);
      toAccount.balance = (Number(toAccount.balance) + amount).toFixed(2);
      await manager.save([fromAccount, toAccount]);

      const transaction = manager.create(Transaction, {
        user: fromAccount.user,
        type: 'transfer',
        description:
          description ||
          `Transfer ${amount} ${currency} from user ${fromUserId} to ${toUserId}`,
        totalAmount: amount.toFixed(2),
        currency,
      });
      const savedTx = await manager.save(transaction);

      await this.ledgerEntryService.createDoubleEntry({
        manager,
        transaction: savedTx,
        fromAccount,
        toAccount,
        amount,
        currency,
      });

      return savedTx;
    });
  }

  async exchange({
    userId,
    fromCurrency,
    toCurrency,
    amount,
  }: ExchangeDTO & { userId: string }) {
    if (fromCurrency === toCurrency) {
      throw new BadRequestException('Cannot exchange the same currency');
    }

    return this.dataSource.transaction(async (manager) => {
      const fromAccount = await manager.findOne(Account, {
        where: { user: { id: userId }, currency: fromCurrency },
        relations: ['user'],
        lock: { mode: 'pessimistic_write' },
      });

      const toAccount = await manager.findOne(Account, {
        where: { user: { id: userId }, currency: toCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('User accounts for currencies not found');
      }

      if (Number(fromAccount.balance) < amount) {
        throw new BadRequestException('Insufficient balance for exchange');
      }

      const rate = this.exchangeRateService.getRate(fromCurrency, toCurrency);

      const fromAmount = amount;
      const toAmount = +(amount * rate).toFixed(2);

      fromAccount.balance = (Number(fromAccount.balance) - fromAmount).toFixed(
        2,
      );
      toAccount.balance = (Number(toAccount.balance) + toAmount).toFixed(2);

      await manager.save([fromAccount, toAccount]);

      const transaction = manager.create(Transaction, {
        user: fromAccount.user,
        type: 'exchange',
        description: `Exchange ${fromAmount} ${fromCurrency} → ${toAmount} ${toCurrency}`,
        totalAmount: fromAmount.toFixed(2),
        currency: fromCurrency,
      });
      const savedTx = await manager.save(transaction);

      await this.ledgerEntryService.createExchangeEntries({
        manager,
        transaction: savedTx,
        fromAccount,
        toAccount,
        fromAmount,
        toAmount,
        fromCurrency,
        toCurrency,
      });

      return {
        transaction: savedTx,
        rate,
        fromAccount,
        toAccount,
      };
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
