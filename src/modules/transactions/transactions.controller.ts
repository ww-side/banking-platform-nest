import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~/shared/guards/auth-guard';
import { TokenService } from '~/shared/services/token.service';

import { ExchangeDTO, TransferDTO } from './dto';
import {
  ExchangeDoc,
  GetTransactionsDoc,
  TransferDoc,
} from './transactions.docs';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard)
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('transfer')
  @TransferDoc()
  transfer(
    @Body() dto: TransferDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const userId = this.tokenService.extractUserId(authHeader);
    return this.transactionsService.transfer({ ...dto, fromUserId: userId });
  }

  @Post('exchange')
  @ExchangeDoc()
  exchange(
    @Body() dto: ExchangeDTO,
    @Headers('Authorization') authHeader: string,
  ) {
    const userId = this.tokenService.extractUserId(authHeader);
    return this.transactionsService.exchange({ ...dto, userId });
  }

  @Get()
  @GetTransactionsDoc()
  get(
    @Headers('Authorization') authHeader: string,
    @Query('type') type?: 'transfer' | 'exchange',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const userId = this.tokenService.extractUserId(authHeader);
    return this.transactionsService.getTransactions({
      userId,
      type,
      page: Number(page),
      limit: Number(limit),
    });
  }
}
