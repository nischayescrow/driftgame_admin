import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  createGameMode(@Body() createGameModeDto: CreateGameModeDto) {
    return this.gamemodeService.create(createGameModeDto);
  }

  @Get('gamemode/findall')
  findAllGameMode(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('all') all: boolean,
  ) {
    return this.gamemodeService.findAll(limit, page, all);
  }

  @Get('gamemode/find/:id')
  findOneGameMode(@Param('id') id: string, @Query('all') all: boolean) {
    return this.gamemodeService.findById(id, all);
  }

  @Patch('gamemode/update/:id')
  updateGameMode(
    @Param('id') id: string,
    @Body() updateGameModeDto: UpdateGameModeDto,
  ) {
    return this.gamemodeService.updateById(id, updateGameModeDto);
  }

  @Delete('gamemode/delete/:id')
  removeGameMode(@Param('id') id: string) {
    return this.gamemodeService.deleteById(id);
  }
}
