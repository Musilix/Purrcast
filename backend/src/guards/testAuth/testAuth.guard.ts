import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { WhoAmIFor } from './whoAmIFor.decorator';

@Injectable()
export class TestAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException(
        "You aren't authorized to access this resource.",
      );
    }

    const user = (await this.verifyToken(token)) ?? null;
    req.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SUPABASE_JWT_SECRET'),
      });

      return payload;
    } catch {
      throw new UnauthorizedException(
        'You need to log in to access this resource',
      );
    }
  }
}

@Injectable()
export class TestSuperAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const whoAmIFor = this.reflector.get(WhoAmIFor, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (
      user &&
      user.user_metadata.full_name
        .toLowerCase()
        .includes(whoAmIFor.toLowerCase())
    ) {
      return true;
    } else {
      throw new UnauthorizedException(
        `You are not authorized to access this resource. You must be a ${whoAmIFor} to access this.`,
      );
    }
  }
}
