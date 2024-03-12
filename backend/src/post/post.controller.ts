import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // TODO: make this the official creation endpoint
  // A new post getting created only needs 1 thing from the user - the photo they are uploading
  // the rest of the information can be gathered from the user's cookie, such as their location and user id
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

  // @Get('/RBAC/kareem')
  // @UseGuards(TestAuthGuardWithRBAC)
  // @WhoAmIFor('Kareem')
  // kareemsRoute() {
  //   return 'This content is only for Kareem';
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
