import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { __file_parse_validators__ } from 'src/constants';
import { TestAuthGuard } from 'src/guards/testAuth/testAuth.guard';
// import { TestDataPipe } from 'src/pipes/MyCustomPipe2';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('upload')
  @UseGuards(TestAuthGuard)
  @UseInterceptors(FileInterceptor('userUploadedFile'))
  // @UsePipes(new ZodValidationPipe(createPostSchema)) test
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: __file_parse_validators__,
      }),
    )
    file,
    @Req() req,
  ) {
    /* NOTE 
        we can be confident that our req.user holds the user's information since we have our auth guard in place
        and published will always instrinically be true, but can be switched to false if a user "deletes" their post
    */
    return this.postService.upload(file, req.user.sub);
  }

  // @UsePipes(TestDataPipe)
  // @Post('/test-validation')
  // createTest(@Body() data) {
  //   logger.log('pipe working!');
  //   return (
  //     'We were able to validate the data! you gave us: ' + JSON.stringify(data)
  //   );
  // }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
