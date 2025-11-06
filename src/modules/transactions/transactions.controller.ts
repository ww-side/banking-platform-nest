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
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = this.tokenService.extractUserId(authHeader);

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const safeType =
      type === 'transfer' || type === 'exchange' ? type : undefined;

    return this.transactionsService.getTransactions({
      userId,
      type: safeType,
      page: isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber,
      limit: isNaN(limitNumber) || limitNumber < 1 ? 10 : limitNumber,
    });
  }
}
