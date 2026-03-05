import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id') id: string,
    @Query('all') all: boolean,
    @Query('pass') pass: boolean,
  ) {
    return this.userService.findById(id.trim(), all, pass);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchUser(
    @Query('text') text: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('all') all: boolean,
    @Query('pass') pass: boolean,
  ) {
    if (!text || text.length < 1) {
      return this.userService.findAll(limit, page, pass);
    }

    return this.userService.search(text, limit, page, all, pass);
  }

  @Get('get/all')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('pass') pass: boolean,
  ) {
    return this.userService.findAll(limit, page, pass);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateById(id.trim(), updateUserDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(id.trim());
  }
}
