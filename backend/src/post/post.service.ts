import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    try {
      const res = this.prisma.post.create({ data: createPostDto });
      return res;
    } catch (e) {
      return new Error('Unable to create new post');
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
