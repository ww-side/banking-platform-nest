import { IsEmail, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @IsEmail({}, { message: 'Email must be valid' })
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    example: 'strongPassword',
    description: 'User password, min 6 chars',
  })
  password: string;
}
