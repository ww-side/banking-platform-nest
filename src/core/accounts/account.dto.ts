import { ApiProperty } from '@nestjs/swagger';

export class AccountResponseDTO {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 1000.0 })
  balance: number;
}
