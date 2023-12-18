import {
  Body,
  Controller,
  // Delete,
  // Get,
  // Param,
  // Patch,
  Post,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    console.log(
      `Creating a new Post with the following information: ${JSON.stringify(
        createPostDto,
      )}`,
    );

    return this.postService.create(createPostDto);
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
