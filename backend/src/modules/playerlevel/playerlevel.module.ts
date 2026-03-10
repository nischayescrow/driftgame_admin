import { Module } from '@nestjs/common';
import { PlayerlevelService } from './playerlevel.service';
import { PlayerlevelController } from './playerlevel.controller';
import { PlayerLevelRepository } from './playerlevel.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerLevel, PlayerLevelSchema } from './schemas/playerLevel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlayerLevel.name, schema: PlayerLevelSchema },
    ]),
  ],
  controllers: [PlayerlevelController],
  providers: [PlayerlevelService, PlayerLevelRepository],
  exports: [PlayerlevelService],
})
export class PlayerlevelModule {}
