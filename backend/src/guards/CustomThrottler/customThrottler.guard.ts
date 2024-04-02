import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class PostThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      "To help us reduce resource usage (we're a 1 man team!), we only allow 3 posts per minute. Please give it a moment and try again. Sorry for the inconvenience.",
    );
  }
}
