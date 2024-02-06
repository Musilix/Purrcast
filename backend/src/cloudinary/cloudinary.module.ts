import { Module } from '@nestjs/common';
import * as cloudinaryLib from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

export const cloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: () => {
    const cloudinary = cloudinaryLib.v2;
    cloudinary.config({
      cloud_name: 'purrcast',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return cloudinary;
  },
};

@Module({
  providers: [CloudinaryService, cloudinaryProvider],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
