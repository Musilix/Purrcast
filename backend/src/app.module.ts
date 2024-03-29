import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TestAuthModule } from './guards/testAuth/testAuth.module';

@Module({
  imports: [
    UsersModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TestAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
