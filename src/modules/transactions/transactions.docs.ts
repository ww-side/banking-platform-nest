import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { ExchangeDTO } from './dto/exchange.dto';
import { TransferDTO } from './dto/transfer.dto';

export function TransferDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Transfer funds to another user',
      description:
        'Transfers a specific amount between two user accounts of the same currency. Prevents overdrafts and concurrent issues.',
    }),
    ApiBody({ type: TransferDTO }),
    ApiResponse({
      status: 201,
      description: 'Transfer completed successfully',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid input, insufficient balance, or transfer to the same user',
    }),
    ApiResponse({
      status: 404,
      description: 'Account not found for one of the users',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function ExchangeDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Exchange currency between user accounts',
      description:
        'Converts a given amount from one currency to another using a fixed rate (1 USD = 0.92 EUR). Ensures precision and atomicity.',
    }),
    ApiBody({ type: ExchangeDTO }),
    ApiResponse({
      status: 201,
      description: 'Exchange operation completed successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid currency pair or insufficient balance',
    }),
    ApiResponse({
      status: 404,
      description: 'User account not found for one of the currencies',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetTransactionsDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'List user transactions',
      description:
        'Fetches transactions for the authenticated user. Supports filtering by type and pagination.',
    }),
    ApiQuery({
      name: 'type',
      required: false,
      description: 'Filter by transaction type',
      enum: ['transfer', 'exchange'],
      example: 'transfer',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of items per page (default: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description:
        'List of transactions returned successfully with pagination metadata',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
