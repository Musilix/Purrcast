import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CustomAuthMessage } from './customAuthMessage.decorator';
import { WhoAmIFor } from './whoAmIFor.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector = new Reflector(),
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    const customMessage = this.reflector.get(
      CustomAuthMessage,
      context.getHandler(),
    );

    if (!token) {
      throw new UnauthorizedException(
        'You must login to access this resource.',
      );
    }

    try {
      const user = await this.verifyToken(token);
      req.user = user;
    } catch (e) {
      throw new UnauthorizedException(
        customMessage
          ? customMessage
          : "You aren't authorized to access this resource.",
      );
    }

    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  protected async verifyToken(token: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('SUPABASE_JWT_SECRET'),
    });

    return payload;
  }
}

@Injectable()
export class JwtSuperAuthGuard implements CanActivate {
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

// More lax version of JwtAuthGuard, allowing someone to access a resource even if they aren't logged in, but tacking on their user info if they are logged in
@Injectable()
export class JwtOptionalGuard extends JwtAuthGuard implements CanActivate {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (token) {
      try {
        const user = await this.verifyToken(token);
        req.user = user;
      } catch (e) {
        // Token verification failed, but we proceed without throwing an error
        req.user = null;
      }
    } else {
      req.user = null;
    }

    return true;
  }
}
