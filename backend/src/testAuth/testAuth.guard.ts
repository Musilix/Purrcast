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

@Injectable()
export class TestAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private logger = new Logger('TestAuthGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException(
        "You aren't authorized to access this resource.",
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('SUPABASE_JWT_SECRET'),
      });

      req.user = payload;
    } catch {
      throw new UnauthorizedException(
        'You need to log in to access this resource',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// export class TestAuthGuardWithRBAC implements CanActivate {
//     constructor(private readonly reflector: Reflector) {}

//     canActivate(context: ExecutionContext): boolean {
//         const whoAmIFor = this.reflector.get('whoAmIFor', context.getHandler());
//         if (!whoAmIFor) {
//             return true;
//         }

//         const req = context.switchToHttp().getRequest();
//         const user = req.user;

//         return user.name === whoAmIFor;
//     }
// }
