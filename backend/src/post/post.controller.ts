import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
// import {
//   createPostSchema,
//   CreatePostDto,
// } from '../../../lib/schemas/PostSchema';
// import { ZodValidationPipe } from 'src/pipes/ZodValidationPipe';
import { TestAuthGuard } from 'src/guards/testAuth/testAuth.guard';

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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (file === undefined || file === null) {
      return `No file was uploaded. ${file}`;
    } else {
      return this.postService.upload(file);
    }
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
