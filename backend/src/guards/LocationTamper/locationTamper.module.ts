import { Module } from '@nestjs/common';
import { LocationTamperGuard } from './locationTamper.guard';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';
import BcryptService from 'src/bcrypt/bcrypt.service';

@Module({
  providers: [LocationTamperGuard, BcryptService],
  exports: [LocationTamperGuard, BcryptService],
  imports: [BcryptModule],
})
export class LocationTamperModule {}
