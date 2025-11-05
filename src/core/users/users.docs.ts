import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateUserDTO, UpdateUserDTO } from './dto';

export function CreateUserDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiBody({ type: CreateUserDTO }),
    ApiResponse({ status: 201, description: 'User successfully created' }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
  );
}

export function FindAllUsersDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiResponse({ status: 200, description: 'List of all users returned' }),
  );
}

export function FindUserByEmailDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by email' }),
    ApiParam({
      name: 'email',
      description: 'User email address',
      example: 'user@example.com',
    }),
    ApiResponse({ status: 200, description: 'User found' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function FindUserByIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: 'f1a7c2a8-9a7b-45f5-b51d-7b9f1d1f82c3',
    }),
    ApiResponse({ status: 200, description: 'User found' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function UpdateUserDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update current user data' }),
    ApiBody({ type: UpdateUserDTO }),
    ApiResponse({ status: 200, description: 'User successfully updated' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function DeleteUserDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete current user' }),
    ApiResponse({ status: 200, description: 'User successfully deleted' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
