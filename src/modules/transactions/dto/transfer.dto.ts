import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class TransferDTO {
  @ApiProperty({
    example: 'b1fcb56e-59f5-44b6-a5f3-7efde24fbb4e',
    description: 'Recipient user ID',
  })
  @IsString()
  @IsNotEmpty({ message: 'To user ID is required' })
  toUserId: string;

  @ApiProperty({
    example: 150.5,
    description: 'Amount to transfer (must not exceed sender balance)',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency of the transfer',
  })
  @IsString()
  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;

  @ApiProperty({
    example: 'Payment for services',
    description: 'Optional transaction description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
