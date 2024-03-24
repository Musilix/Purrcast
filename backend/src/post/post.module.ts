import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TestAuthModule } from 'src/guards/testAuth/testAuth.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [PrismaModule, CloudinaryModule, TestAuthModule],
})
export class PostModule {}
