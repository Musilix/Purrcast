import { Module } from '@nestjs/common';
import { LocationTamperGuard } from './locationTamper.guard';

@Module({
  providers: [LocationTamperGuard],
  exports: [LocationTamperGuard],
})
export class LocationTamperModule {}
