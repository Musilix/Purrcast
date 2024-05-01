import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/guards/JwtAuth/jwtAuth.guard';
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
  @SkipThrottle()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('/location')
  @UseGuards(JwtAuthGuard)
  getLocation(@Body() location: { lat: number; lon: number }) {
    const coordsToLocation = this.usersService.getLocation(location);

    return coordsToLocation;
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
