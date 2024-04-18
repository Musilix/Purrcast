import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
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
import { SkipThrottle } from '@nestjs/throttler';
import { PostService } from './post.service';
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
    @Body() body,
    @Req() req,
  ) {
    /* NOTE 
        we can be confident that our req.user holds the user's information since we have our auth guard in place
        and published will always instrinically be true, but can be switched to false if a user "deletes" their post
    */
    const { userState, userCity } = body;

    return this.postService.upload(
      file,
      req.user.sub,
      parseInt(userState),
      parseInt(userCity),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  // @SkipThrottle()
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

  // TODO - need to change the name of this endpoint. it's confusing a lil with the other nearby endpoint
  @Post('/nearme')
  @SkipThrottle()
  findAllNearMe(@Body() body: { location: { lat: number; long: number } }) {
    return this.postService.findAllNearMe(
      body.location.lat,
      body.location.long,
    );
  }
  // TODO - body should be UserLocationDTO
  @Post('/nearby')
  @SkipThrottle()
  findAllNearby(@Body() body) {
    return this.postService.findAllNearby(
      parseInt(body.userState),
      parseInt(body.userCity),
    );
  }

  @Get(':id')
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  //TODO - put this in a different controller
  @Get('/forecast/:state/:city')
  getForecast(
    @Param('state', ParseIntPipe) state: number,
    @Param('city', ParseIntPipe) city: number,
  ) {
    return this.postService.getForecast(state, city);
  }
}
