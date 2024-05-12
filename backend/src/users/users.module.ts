import { Module } from '@nestjs/common';
import { JwtAuthModule } from 'src/guards/JwtAuth/jwtAuth.module';
import { LocationTamperModule } from 'src/guards/LocationTamper/locationTamper.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, LocationTamperModule, BcryptModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
