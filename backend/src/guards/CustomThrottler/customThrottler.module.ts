import { Module } from '@nestjs/common';
import { PostThrottlerGuard } from './customThrottler.guard';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [],
  providers: [PostThrottlerGuard],
  exports: [PostThrottlerGuard],
})
// Modules can extend other modules I guess?! I' not sure what the implications of that are with the @Module decorator
export class PostThrottlerModule extends ThrottlerModule {}
