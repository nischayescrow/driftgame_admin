import { forwardRef, Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Leaderboard, LeaderboardSchema } from './schemas/leaderboard.schema';
import { UserModule } from '../user/user.module';
import { LeaderboardRepository } from './repositories/leaderboard.repository';
import { GamemodeModule } from '../gamemode/gamemode.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Leaderboard.name, schema: LeaderboardSchema },
    ]),
    forwardRef(() => UserModule),
    GamemodeModule,
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, LeaderboardRepository],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
