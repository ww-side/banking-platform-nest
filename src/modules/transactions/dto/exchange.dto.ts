import { IsEnum, IsNumber, IsPositive } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ExchangeDTO {
  @ApiProperty({
    enum: ['USD', 'EUR'],
    example: 'USD',
    description: 'Currency to exchange from',
  })
  @IsEnum(['USD', 'EUR'])
  fromCurrency: 'USD' | 'EUR';

  @ApiProperty({
    enum: ['USD', 'EUR'],
    example: 'EUR',
    description: 'Currency to exchange to',
  })
  @IsEnum(['USD', 'EUR'])
  toCurrency: 'USD' | 'EUR';

  @ApiProperty({
    example: 10,
    description: 'Amount to exchange (must be positive)',
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
