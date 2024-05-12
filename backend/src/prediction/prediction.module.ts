import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PredictionService } from './prediction.service';

@Module({
  controllers: [],
  providers: [PredictionService],
  exports: [PredictionService],
  imports: [PrismaModule],
})
export class PredictionModule {}
