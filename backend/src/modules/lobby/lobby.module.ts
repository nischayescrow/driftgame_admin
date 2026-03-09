import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameMode, GameModeSchema } from './schemas/gameMode.schema';
import { GamemodeService } from './gamemode/gamemode.service';
import { GameModeRepository } from './repositories/gamemode.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameMode.name, schema: GameModeSchema },
    ]),
  ],
  controllers: [LobbyController],
  providers: [LobbyService, GamemodeService, GameModeRepository],
  exports: [LobbyService, GamemodeService],
})
export class LobbyModule {}
