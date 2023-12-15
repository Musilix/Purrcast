import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { __prod__ } from './constants';
import { TestData } from './temp-entities/TestData.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): TestData {
    const helloData = this.appService.getHello();
    return helloData;
  }

  @Get('/env')
  getEnvironment(): TestData {
    return {
      data: {
        message: __prod__ ? 'Production' : 'Development',
      },
      statusCode: 200,
    };
  }
}
