import {
  Body,
  Controller,
  // Delete,
  // Get,
  // Param,
  // Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }

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
