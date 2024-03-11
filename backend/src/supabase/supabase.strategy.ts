import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    // Call Passport Strategy constructor with the options we want to give
    super({
      /* Required field we must include in our constructor options
                - Defines how we extract our JWT
                - Passport itself provides a few different methods for extracting a JWT from a request in it's passport-jwt package.
            */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Required field we must include in our constructor options if we don't include _
      secretOrKey: configService.get('SUPABASE_JWT_SECRET'),

      // This would be dumb not to include
      ignoreExpiration: false,
    });
  }
}
