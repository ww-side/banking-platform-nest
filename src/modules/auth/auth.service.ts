import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '~/core/users/users.service';

import { TokenService } from '~/shared/services/token.service';
import { compare } from '~/shared/utils/hashing';

import { LoginDTO, RegisterDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async register(data: RegisterDTO) {
    const user = await this.usersService.create(data);
    const { accessToken, refreshToken } = await this.generateSession(user.id);

    return { user, accessToken, refreshToken };
  }

  async login({ email, password }: LoginDTO) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const match = await compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.generateSession(user.id);

    return { user, accessToken, refreshToken };
  }

  async getProfile(authHeader: string) {
    const token = authHeader?.split(' ')[1];
    const userId = this.tokenService.extractUserId(token);
    return this.usersService.findOne(userId);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ id: string }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const cachedToken = await this.cacheManager.get<string>(
        `session:${payload.id}`,
      );

      if (!cachedToken || cachedToken !== refreshToken) {
        throw new ForbiddenException('Invalid or expired refresh token');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateSession(payload.id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateSession(userId: string) {
    const accessToken = this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );

    await this.cacheManager.set<string>(
      `session:${userId}`,
      refreshToken,
      7 * 24 * 60 * 60,
    );

    return { accessToken, refreshToken };
  }
}
