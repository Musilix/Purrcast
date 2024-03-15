import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { TestAuthGuard } from 'src/guards/testAuth/testAuth.guard';
import { TestDataPipe } from 'src/pipes/MyCustomPipe2';
import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { createPostSchema } from '../../../lib/schemas/PostSchema';
import { Request } from 'express';
const logger: Logger = new Logger('PostController');

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // TODO: make this the official creation endpoint
  // A new post getting created only needs 1 thing from the user - the photo they are uploading
  // the rest of the information can be gathered from the user's cookie, such as their location and user id
  @Post('upload')
  // @UsePipes(new ZodValidationPipe(createPostSchema))
  @UseGuards(TestAuthGuard)
  // Remove this and use our zod pipe to validate the req payload has a file, THEN extract that file...
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (file === undefined || file === null) {
      return `No file was uploaded. ${file}`;
    } else {
      // return this.postService.upload(file, req.authorId);
      return this.postService.upload(file, req.user.sub);
    }
  }

  // @UsePipes(new ZodValidationPipe(TestDataSchema))
  @UsePipes(TestDataPipe)
  @Post('/test-validation')
  createTest(@Body() data) {
    logger.log('pipe working!');
    return (
      'We were able to validate the data! you gave us: ' + JSON.stringify(data)
    );
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
