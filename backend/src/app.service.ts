import { Injectable } from '@nestjs/common';
import { TestData } from './temp-entities/TestData.entity';

@Injectable()
export class AppService {
  getHello(): TestData {
    return {
      data: { message: 'Hello World!' },
      statusCode: 200,
    };
  }
}
