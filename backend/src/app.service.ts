import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      data: { message: 'Hello Sqworld!' },
      statusCode: 200,
    };
  }
}
