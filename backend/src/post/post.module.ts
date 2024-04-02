import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtAuthModule } from 'src/guards/JwtAuth/jwtAuth.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [PrismaModule, CloudinaryModule, JwtAuthModule],
})
export class PostModule {}
