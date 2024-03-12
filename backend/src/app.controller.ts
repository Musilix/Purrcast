import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestAuthGuard } from './testAuth/testAuth.guard';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "hello b'world!";
  }

  @Get('/secret')
  @UseGuards(TestAuthGuard)
  getSecret() {
    return 'How did you find this?';
  }
}
