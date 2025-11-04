import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
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

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;
}
