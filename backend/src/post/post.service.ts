import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  // create(createPostDto: CreatePostDto) {
  //   try {
  //     const res = this.prisma.post.create({ data: createPostDto });
  //     return res;
  //   } catch (e) {
  //     return new Error('Unable to create new post');
  //   }
  // }

  upload(file: any) {
    try {
      const res = this.cloudinary.upload(file, {
        type: 'upload',
        access_control: 'anonymous',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        format: 'jpg',
      });

      return res;
    } catch (e) {
      return new Error('Unable to upload file');
    }
  }

  // findAll() {
  //   return `This action returns all post`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} post`;
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`;
  // }
}
