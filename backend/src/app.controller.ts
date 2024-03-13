import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  TestAuthGuard,
  TestSuperAuthGuard,
} from './guards/testAuth/testAuth.guard';
import { WhoAmIFor } from './guards/testAuth/whoAmIFor.decorator';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "hello b'world!";
  }

  /* NOTE 
      This is a route that will provide only 401 errors if the user does not send a token with their requests
  */
  @Get('/secret')
  @UseGuards(TestAuthGuard)
  getSecret() {
    return 'How did you find this?';
  }

  /* NOTE
      This is an example route that will provide 403 errors if the users is not of a specific role type
      and 401 errors if the user didnt send a proper token with their request
  */
  @Get('/kareems-secret')
  @WhoAmIFor('kareem')
  @UseGuards(TestAuthGuard, TestSuperAuthGuard)
  getKareemsSecret() {
    return 'A secret for Kareem only! I like toast with butter and jam!';
  }

  @Get('/sunnis-secret')
  @WhoAmIFor('sunni')
  @UseGuards(TestAuthGuard, TestSuperAuthGuard)
  getSunnisSecret() {
    return 'A secret for Sunni only! I love you to the moon and beyond!';
  }
}
