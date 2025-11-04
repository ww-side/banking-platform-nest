import { Response } from 'express';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthGuard } from '~/shared/guards/auth-guard';

import { AuthService } from './auth.service';
import { RefreshTokenDTO } from './dto';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: RegisterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(data);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Post('login')
  async login(
    @Body() data: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(data);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getProfile(@Headers('Authorization') authHeader: string) {
    return this.authService.getProfile(authHeader);
  }

  @Post('refresh')
  async refreshTokens(
    @Body() { refreshToken }: RefreshTokenDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);
    this.setAuthCookies(res, accessToken, newRefreshToken);
    return { message: 'Tokens refreshed' };
  }

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
