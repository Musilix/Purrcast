import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/guards/JwtAuth/jwtAuth.module';
import { LocationTamperModule } from 'src/guards/LocationTamper/locationTamper.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, JwtAuthModule, LocationTamperModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
