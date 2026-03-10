import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlayerlevelService } from './playerlevel.service';
import { CreatePlayerlevelDto } from './dto/create-playerlevel.dto';
import { UpdatePlayerlevelDto } from './dto/update-playerlevel.dto';

@Controller('admin/playerlevel')
export class PlayerlevelController {
  constructor(private readonly playerlevelService: PlayerlevelService) {}

  // <============== GameMode ==============>
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createPlayerLevel(@Body() createPlayerlevelDto: CreatePlayerlevelDto) {
    return this.playerlevelService.create(createPlayerlevelDto);
  }

  @Get('findall')
  @HttpCode(HttpStatus.OK)
  findAllLevel(@Query('limit') limit: number, @Query('page') page: number) {
    return this.playerlevelService.findAll(limit, page);
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findOneLevel(@Param('id') id: string) {
    return this.playerlevelService.findById(id);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchLevel(
    @Query('text') text: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    if (!text || text.length < 1) {
      return this.playerlevelService.findAll(limit, page);
    }

    return this.playerlevelService.search(text, limit, page);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updatePlayerLevel(
    @Param('id') id: string,
    @Body() updatePlayerlevelDto: UpdatePlayerlevelDto,
  ) {
    return this.playerlevelService.updateById(id, updatePlayerlevelDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  removePlayerLevel(@Param('id') id: string) {
    return this.playerlevelService.deleteById(id);
  }
}
