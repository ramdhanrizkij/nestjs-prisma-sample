import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('post')
@ApiTags("Post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    createPostDto.authorId = req.user.id
    return await this.postService.create(createPostDto);
  }

  @Get()
  async findAll() {
    return this.postService.findAll({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne({id:+id});
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update({
      where: {
        id:+id
      },
      data: updatePostDto
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.postService.remove({
      id:+id
    });
  }
}
