import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
// import { JwtAuthGuard } from 'src/guards/JwtAuth/jwtAuth.guard';
import { LocationTamperGuard } from 'src/guards/LocationTamper/locationTamper.guard';
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

  // Get a reverse geocoded location (w/ a fingerprint) for the given coordinates
  @Post('/location')
  @SkipThrottle()
  // @UseGuards(JwtAuthGuard, LocationTamperGuard)
  @UseGuards(LocationTamperGuard)
  getLocation(@Body() locationInCoords: { lat: number; lon: number }) {
    return this.usersService.getLocation(locationInCoords);
  }

  // Get a special object containing the coords that were sent plus a fingerprint for authenticity checks in the future
  @Post('/location/special-coords')
  @SkipThrottle()
  // @UseGuards(LocationTamperGuard)
  getSpecialCoords(@Body() locationInCoords: { lat: number; lon: number }) {
    return this.usersService.getSpecialCoords(locationInCoords);
  }
}
