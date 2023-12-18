import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file === undefined) {
      return `No file was uploaded. ${file}`;
    } else {
      return {
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    }
  }
}
