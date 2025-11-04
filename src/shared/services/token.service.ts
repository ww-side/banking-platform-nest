import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  extractUserId(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Invalid or missing Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify<{ id: string }>(token);
      return decoded.id;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
