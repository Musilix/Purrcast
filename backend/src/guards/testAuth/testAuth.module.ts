import { Module } from '@nestjs/common';
import { TestAuthGuard, TestSuperAuthGuard } from './testAuth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  providers: [TestAuthGuard, TestSuperAuthGuard],
  exports: [TestAuthGuard, TestSuperAuthGuard, JwtModule],
})
export class TestAuthModule {}
