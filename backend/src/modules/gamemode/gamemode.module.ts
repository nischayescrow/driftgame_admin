import { Module } from '@nestjs/common';
import { GamemodeService } from './gamemode.service';
import { GamemodeController } from './gamemode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GameMode, GameModeSchema } from './schemas/gameMode.schema';
import { GameModeRepository } from './gamemode.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameMode.name, schema: GameModeSchema },
    ]),
  ],
  controllers: [GamemodeController],
  providers: [GamemodeService, GameModeRepository],
  exports: [GamemodeService],
})
export class GamemodeModule {}
