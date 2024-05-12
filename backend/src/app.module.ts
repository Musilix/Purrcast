import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostThrottlerGuard } from './guards/CustomThrottler/customThrottler.guard';
import { PostThrottlerModule } from './guards/CustomThrottler/customThrottler.module';
import { JwtAuthModule } from './guards/JwtAuth/jwtAuth.module';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { PredictionModule } from './prediction/prediction.module';

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
    PredictionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: 'APP_GUARD', useClass: PostThrottlerGuard },
  ],
})
export class AppModule {}
