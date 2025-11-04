import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { LoginDTO, RefreshTokenDTO, RegisterDTO } from './dto';

export function RegisterDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user with session' }),
    ApiBody({ type: RegisterDTO }),
    ApiResponse({ status: 201, description: 'User successfully registered' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
  );
}

export function LoginDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: LoginDTO }),
    ApiResponse({ status: 200, description: 'User successfully logged in' }),
    ApiResponse({ status: 400, description: 'Invalid credentials' }),
  );
}

export function GetProfileDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({ status: 200, description: 'User profile returned' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function RefreshTokensDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access and refresh tokens' }),
    ApiBody({ type: RefreshTokenDTO }),
    ApiResponse({ status: 200, description: 'Tokens successfully refreshed' }),
    ApiResponse({ status: 400, description: 'Invalid refresh token' }),
  );
}
