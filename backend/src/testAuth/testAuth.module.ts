import { Module } from '@nestjs/common';
import { TestAuthGuard } from './testAuth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [TestAuthGuard],
  exports: [TestAuthGuard, JwtModule],
})
export class TestAuthModule {}
