import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { z } from 'zod';
import { UsersService } from './users.service';

// TODO - temporary solution to the problem of not being able to use zod schemas in the service
const createUserSchema = z.object({
  name: z.string().optional(),
  uuid: z.string(),
  bio: z.string().optional(),
  username: z.string(),
  location: z.string().optional(),
});

type CreateUserDto = z.infer<typeof createUserSchema>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
