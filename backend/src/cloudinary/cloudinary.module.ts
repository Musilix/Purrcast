import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import * as cloudinaryLib from 'cloudinary';

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
