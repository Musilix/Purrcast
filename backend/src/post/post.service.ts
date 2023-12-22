import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreatePostDto } from './dto/create-post.dto';

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

  async upload(file: any) {
    try {
      const res = await this.cloudinary.upload(file, {
        type: 'upload',
        access_control: 'anonymous',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        format: 'jpg',
      });

      // TODO: change to true implementation
      // get user data placeholder
      const user = await this.prisma.user.findUnique({ where: { id: 1 } });
      await this.prisma.post.create({
        data: {
          contentId: `v${res.version}/${res.public_id}.png`,
          authorId: user.id,
          published: true,
        },
      });

      return res;
    } catch (e) {
      return new Error('Unable to upload file');
    }
  }

  async getImage(postId: string) {
    try {
      const res = await this.cloudinary.getUpload(postId);
      return res;
    } catch (e) {
      return new Error('Unable to get image');
    }
  }

  async findAll() {
    const res = await this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
    return res;
  }

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
