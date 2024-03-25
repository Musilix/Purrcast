import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

// TODO - temporary solution to the problem of not being able to use zod schemas in the service
const createUserSchema = z.object({
  name: z.string().optional(),
  uuid: z.string(),
  bio: z.string().optional(),
  username: z.string(),
  location: z.string().optional(),
});

type CreateUserDto = z.infer<typeof createUserSchema>;
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    try {
      const res = this.prisma.user.create({ data: createUserDto });
      return res;
    } catch (e) {
      return new Error('Error creating a User');
    }
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates the user with a name of ${updateUserDto.name} to have an id of ${id}`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
