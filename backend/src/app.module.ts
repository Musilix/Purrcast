import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [UsersModule, PrismaModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
