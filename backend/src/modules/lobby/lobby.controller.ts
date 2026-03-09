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
import { LobbyService } from './lobby.service';
import { CreateGameModeDto } from './dto/createGameMode.dto';
import { UpdateGameModeDto } from './dto/updateGameMode.dto';
import { GamemodeService } from './gamemode/gamemode.service';

@Controller('admin/lobby')
export class LobbyController {
  constructor(
    private readonly lobbyService: LobbyService,
    private readonly gamemodeService: GamemodeService,
  ) {}

  // <============== GameMode ==============>
  @Post('gamemode/create')
  @HttpCode(HttpStatus.CREATED)
  createGameMode(@Body() createGameModeDto: CreateGameModeDto) {
    return this.gamemodeService.create(createGameModeDto);
  }

  @Get('gamemode/findall')
  @HttpCode(HttpStatus.OK)
  findAllGameMode(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('all') all: boolean,
  ) {
    return this.gamemodeService.findAll(limit, page, all);
  }

  @Get('gamemode/find/:id')
  @HttpCode(HttpStatus.OK)
  findOneGameMode(@Param('id') id: string, @Query('all') all: boolean) {
    return this.gamemodeService.findById(id, all);
  }

  @Get('gamemode/search')
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

  @Patch('gamemode/update/:id')
  @HttpCode(HttpStatus.OK)
  updateGameMode(
    @Param('id') id: string,
    @Body() updateGameModeDto: UpdateGameModeDto,
  ) {
    return this.gamemodeService.updateById(id, updateGameModeDto);
  }

  @Delete('gamemode/delete/:id')
  @HttpCode(HttpStatus.OK)
  removeGameMode(@Param('id') id: string) {
    return this.gamemodeService.deleteById(id);
  }
}
