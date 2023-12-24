import {
  // Body,
  Controller,
  Get,
  // Delete,
  // Get,
  // Param,
  // Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   console.log(
  //     `Creating a new Post with the following information: ${JSON.stringify(
  //       createPostDto,
  //     )}`,
  //   );

  //   return this.postService.create(createPostDto);
  // }

  // Necessary endpoint when generating a signed url to access assets that were uploaded with an access_control>access_type of token
  // @Get('signed-url')
  // getSignedUrl() {
  //   return this.postService.getSignedUrl();
  // }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // TODO
    // Read cookie or some type of token that has user identifier,
    // query data on said user, like location
    // Include that in creation of the post
    // {
    //   contentSrc: this.postService.upload(file).publicId,
    //   authorId: 1,
    //   location: this.prisma.user.find({where: {id: 1}}).location;
    // }
    if (file === undefined) {
      return `No file was uploaded. ${file}`;
    } else {
      return this.postService.upload(file);
    }
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
