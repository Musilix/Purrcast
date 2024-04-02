import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthModule } from './guards/JwtAuth/jwtAuth.module';
import { PostThrottlerModule } from './guards/CustomThrottler/customThrottler.module';
import { PostThrottlerGuard } from './guards/CustomThrottler/customThrottler.guard';

@Module({
  imports: [
    UsersModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtAuthModule,
    PostThrottlerModule.forRoot([
      {
        // 3 requests every 1 minute from 1 person... I'm stingy
        ttl: 60000,
        limit: 3,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'GLOBAL_THROTTLE_GUARD', useClass: PostThrottlerGuard },
  ],
})
export class AppModule {}
