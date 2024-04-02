import { Module } from '@nestjs/common';
import { JwtAuthGuard, JwtSuperAuthGuard } from './jwtAuth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthGuard, JwtSuperAuthGuard],
  exports: [JwtAuthGuard, JwtSuperAuthGuard, JwtModule],
})
export class JwtAuthModule {}
