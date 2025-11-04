import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @IsString()
  @ApiProperty({
    example: 'refreshToken',
    description: 'Refresh token',
  })
  refreshToken: string;
}
