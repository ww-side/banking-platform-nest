import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '~/shared/guards/auth-guard';

import {
  GetProfileDoc,
  LoginDoc,
  RefreshTokensDoc,
  RegisterDoc,
} from './auth.docs';
import { AuthService } from './auth.service';
import { RefreshTokenDTO } from './dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @RegisterDoc()
  register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }

  @Post('login')
  @LoginDoc()
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @GetProfileDoc()
  getProfile(@Headers('Authorization') authHeader: string) {
    return this.authService.getProfile(authHeader);
  }

  @Post('refresh')
  @RefreshTokensDoc()
  async refreshTokens(@Body() { refreshToken }: RefreshTokenDTO) {
    return this.authService.refreshTokens(refreshToken);
  }
}
