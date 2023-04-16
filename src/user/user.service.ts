import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from 'src/auth/jwt.strategy';

@Injectable()
export class UserService {
  
  constructor(private prisma:PrismaService){}

  async findOne(condition: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where:condition
    })
    if(!user) throw new HttpException("User not found", 404)
    return user
  }

  async findAll(params:{
    skip?:number;
    take?:number;
    cursor?:Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where:{
        email: data.email
      }
    })
    if(user){
      throw new HttpException("User with that email already exists", 400);
    }
    return this.prisma.user.create({
      data
    })
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params;
    const user = await this.prisma.user.findFirst({where})
    if(!user) throw new HttpException("User not found", 404)

    return await this.prisma.user.update({
      data:data,
      where:where
    })
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findFirst({where})
    if(!user) throw new HttpException("User not found", 404)
    
    return await this.prisma.user.delete({where})
  }

  async hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 10)
  }

  async comparePassword(password:string, encrypted: string):Promise<Boolean>{
    return await bcrypt.compare(password, encrypted);
  } 

  async findByEmail(email:string): Promise<User | null>{
    return await this.prisma.user.findFirst({
      where: {
        email: email
      }
    })
  }

  async findByPayload(payload: JwtPayload): Promise<User | null>{
    const {id, email} = payload
    return this.prisma.user.findFirst({
      where: {
        id: id,
        email: email
      }
    })
  }
}
