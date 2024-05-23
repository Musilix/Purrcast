import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  JwtAuthGuard,
  JwtOptionalGuard,
  JwtSuperAuthGuard,
} from './jwtAuth.guard';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthGuard, JwtSuperAuthGuard, JwtOptionalGuard],
  exports: [JwtAuthGuard, JwtSuperAuthGuard, JwtOptionalGuard, JwtModule],
})
export class JwtAuthModule {}
