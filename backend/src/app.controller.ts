import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TestData } from './temp-entities/TestData.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): TestData {
    const helloData = this.appService.getHello();
    return helloData;
  }
}
