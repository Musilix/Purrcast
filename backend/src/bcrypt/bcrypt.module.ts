import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import BcryptService from './bcrypt.service';

@Module({
  providers: [BcryptService],
  exports: [BcryptService],
  imports: [ConfigModule],
})
export class BcryptModule {}
