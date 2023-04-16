import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() input: LoginDto) {
    return await this.authService.login(input);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async profile(@Request() req) {
    const {password, ...rest} = req.user
    return {
      status: 200,
      data: rest,
    };
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async create(@Body() input: CreateUserDto) {
    input.password = await this.userService.hashPassword(input.password);
    return await this.userService.create(input);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async findAll() {
    return await this.userService.findAll({});
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne({ id: parseInt(id) });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && updateUserDto.password != '') {
      updateUserDto.password = await this.userService.hashPassword(
        updateUserDto.password,
      );
    }
    return await this.userService.update({
      where: {
        id: +id,
      },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string) {
    return await this.userService.remove({ id: +id });
  }
}
