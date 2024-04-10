import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { __file_parse_validators__ } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/JwtAuth/jwtAuth.guard';
// import { TestDataPipe } from 'src/pipes/MyCustomPipe2';
import { PostService } from './post.service';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { PostThrottlerGuard } from 'src/guards/CustomThrottler/customThrottler.guard';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
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

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @SkipThrottle()
  upvote(@Param('id') id: number, @Req() req) {
    return this.postService.upvote(id, req.user.sub);
  }

  @Get()
  @SkipThrottle()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/mine')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  findAllUserSpecific(@Req() req) {
    return this.postService.findAll(req.user.sub);
  }

  @Post('/nearme')
  @SkipThrottle()
  findAllNearMe(@Body() body: { location: { lat: number; long: number } }) {
    return this.postService.findAllNearMe(
      body.location.lat,
      body.location.long,
    );
  }

  @Get(':id')
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
