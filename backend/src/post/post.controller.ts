import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { __file_parse_validators__ } from 'src/constants';
import { CustomAuthMessage } from 'src/guards/JwtAuth/customAuthMessage.decorator';
import {
  JwtAuthGuard,
  JwtOptionalGuard,
} from 'src/guards/JwtAuth/jwtAuth.guard';
import { LocationTamperGuard } from 'src/guards/LocationTamper/locationTamper.guard';
import UserLocationValidationPipe from 'src/pipes/UserLocationValidationPipe';
import { PostService } from './post.service';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('upload')
  @UseGuards(JwtOptionalGuard)
  @UseInterceptors(FileInterceptor('userUploadedFile'))
  // @UsePipes(new ZodValidationPipe(createPostSchema)) test
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: __file_parse_validators__,
      }),
    )
    file,
    @Body(UserLocationValidationPipe) body,
    @Req() req,
  ) {
    /* NOTE 
        we can be confident that our req.user holds the user's information since we have our auth guard in place
        and published will always instrinically be true, but can be switched to false if a user "deletes" their post
    */
    const { userState, userCity, timezoneOffset } = body;
    const user = req?.user ? req.user.sub : null;

    // FIXME - I don't like having to parse out/manually write out each field I want from the body. The controller shouldnt care!
    // I should just be able to pass the body object to the service and let it handle the parsing
    return this.postService.upload(
      file,
      user,
      parseInt(userState),
      parseInt(userCity),
      parseInt(timezoneOffset),
    );
  }

  @Put(':id')
  @CustomAuthMessage('You need to be logged in to upvote this post... sorry.')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @SkipThrottle()
  upvote(@Param('id') id: number, @Req() req) {
    return this.postService.upvote(id, req.user.sub);
  }

  // TODO - accept another parameter for date range. default is curr day to now()
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @SkipThrottle()
  findAll(@Query('page') page: number = 0) {
    return this.postService.findAll(page);
  }

  // TODO - body should be UserLocationDTO
  // TODO - add hash validtor guard
  @Post('/nearby')
  @UsePipes(new ValidationPipe({ transform: true }))
  @SkipThrottle()
  @UseGuards(LocationTamperGuard)
  findAllNearby(
    @Body() reverseGeocodedLocation,
    @Query('page') page: number = 0,
  ) {
    return this.postService.findAllNearby(
      page,
      parseInt(reverseGeocodedLocation.id_state),
      parseInt(reverseGeocodedLocation.id_city),
    );
  }

  @Post('/mine')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  findAllUserSpecific(@Req() req, @Query('page') page: number = 0) {
    return this.postService.findAll(page, req.user.sub);
  }

  @Get(':id')
  @SkipThrottle()
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  // TODO - I think this is a dead route for now. Maybe remove it in the future?
  // @Post('/nearme')
  // @SkipThrottle()
  // @UseGuards(JwtAuthGuard, LocationTamperGuard)
  // findAllCitiesNearMe(@Body() body: { location: { lat: number; long: number } }) {
  //   return this.postService.findAllNearMe(
  //     body.location.lat,
  //     body.location.long,
  //   );
  // }

  // TODO - this area looks ripe for a Strategy Pattern perhaps...
  @Post('/forecast')
  @SkipThrottle() // Is this smart? I'm not sure yet...
  @UseGuards(LocationTamperGuard)
  getForecast(@Body() reverseGeocodedLocation) {
    return this.postService.getForecast({
      state: parseInt(reverseGeocodedLocation.id_state),
      city: parseInt(reverseGeocodedLocation.id_city),
      timezoneOffset: parseInt(reverseGeocodedLocation.timezoneOffset),
      scope: 'daily',
    });
  }

  @Post('/weekly-forecast')
  @SkipThrottle() // Is this smart? I'm not sure yet...
  @UseGuards(LocationTamperGuard)
  getWeeklyForecast(@Body() reverseGeocodedLocation) {
    return this.postService.getForecast({
      state: parseInt(reverseGeocodedLocation.id_state),
      city: parseInt(reverseGeocodedLocation.id_city),
      timezoneOffset: parseInt(reverseGeocodedLocation.timezoneOffset),
      scope: 'weekly',
    });
  }
}
