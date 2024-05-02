import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtAuthModule } from 'src/guards/JwtAuth/jwtAuth.module';
import { LocationTamperModule } from 'src/guards/LocationTamper/locationTamper.module';
import { PredictionModule } from 'src/prediction/prediction.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    PrismaModule,
    CloudinaryModule,
    JwtAuthModule,
    PredictionModule,
    LocationTamperModule,
  ],
})
export class PostModule {}
