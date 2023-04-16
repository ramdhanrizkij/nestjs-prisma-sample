import { HttpException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService){}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return await this.prisma.post.create({data})
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include:{
        author:{
          select:{
            name: true,
            email: true,
            photo_profile: true
          }
        }
      },
    });
  }

  async findOne(where: Prisma.PostWhereUniqueInput):Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: where,
      include:{
        author:{
          select:{
            name: true,
            email: true,
            photo_profile: true
          }
        }
      },
    })
  }

  async update(params:{
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput
  }) {
    const {where, data} = params
    const post = await this.prisma.post.findFirst({where})
    if(!post) throw new HttpException("Post not found", 404)
    
    return await this.prisma.post.update({
      where: where,
      data: data
    })
  }

  async remove(where: Prisma.PostWhereUniqueInput) {
    const post = await this.prisma.post.findFirst({where})
    if(!post) throw new HttpException("Post not found", 404)

    return await this.prisma.post.delete({
      where: where
    })
  }
}
