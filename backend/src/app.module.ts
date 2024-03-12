import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { TestAuthModule } from './testAuth/testAuth.module';

@Module({
  imports: [
    UsersModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    TestAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
