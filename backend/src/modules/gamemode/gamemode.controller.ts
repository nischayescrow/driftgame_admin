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
import { GamemodeService } from './gamemode.service';
import { CreateGameModeDto } from './dto/createGameMode.dto';
import { UpdateGameModeDto } from './dto/updateGameMode.dto';

@Controller('admin/gamemode')
export class GamemodeController {
  constructor(private readonly gamemodeService: GamemodeService) {}

  // <============== GameMode ==============>
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createGameMode(@Body() createGameModeDto: CreateGameModeDto) {
    return this.gamemodeService.create(createGameModeDto);
  }

  @Get('findall')
  @HttpCode(HttpStatus.OK)
  findAllGameMode(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('all') all: boolean,
  ) {
    return this.gamemodeService.findAll(limit, page, all);
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findOneGameMode(@Param('id') id: string, @Query('all') all: boolean) {
    return this.gamemodeService.findById(id, all);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchUser(
    @Query('text') text: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('all') all: boolean,
  ) {
    if (!text || text.length < 1) {
      return this.gamemodeService.findAll(limit, page, all);
    }

    return this.gamemodeService.search(text, limit, page, all);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateGameMode(
    @Param('id') id: string,
    @Body() updateGameModeDto: UpdateGameModeDto,
  ) {
    return this.gamemodeService.updateById(id, updateGameModeDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  removeGameMode(@Param('id') id: string) {
    return this.gamemodeService.deleteById(id);
  }
}
