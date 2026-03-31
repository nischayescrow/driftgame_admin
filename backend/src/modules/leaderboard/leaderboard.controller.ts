import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import {
  LeaderboardScope,
  LeaderboardTimeFilters,
} from './schemas/leaderboard.schema';
import { isObjectIdOrHexString } from 'mongoose';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    return this.leaderboardService.findById(id.trim());
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  findByUserId(
    @Param('id') id: string,
    @Query('scope') scope: number,
    @Query('game_mode') game_mode?: string,
  ) {
    if (scope > 0 && (game_mode === undefined || game_mode.length <= 0)) {
      throw new BadRequestException('Game mode required!');
    } else if (scope === 0 && game_mode !== undefined) {
      throw new BadRequestException('Global scope do not require game mode!');
    }

    return this.leaderboardService.findByUserId(id.trim(), scope, game_mode);
  }

  // @Post('create')
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() createLeaderboardDto: CreateLeaderboardDto) {
  //   return this.leaderboardService.create(createLeaderboardDto);
  // }

  // @Patch('update/:id')
  // @HttpCode(HttpStatus.OK)
  // updateById(
  //   @Param('id') id: string,
  //   @Body() updateLeaderboardDto: UpdateLeaderboardDto,
  // ) {
  //   return this.leaderboardService.updateById(id.trim(), updateLeaderboardDto);
  // }

  // @Delete('delete/:id')
  // @HttpCode(HttpStatus.OK)
  // deleteById(@Param('id') id: string) {
  //   return this.leaderboardService.deleteById(id.trim());
  // }

  @Get('table')
  @HttpCode(HttpStatus.OK)
  getLeaderboardTable(
    @Query('scope') scope: LeaderboardScope,
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('mode') mode?: string,
    @Query('filter') filter?: LeaderboardTimeFilters,
  ) {
    // Query parameters validation
    if (![0, 1].includes(scope)) {
      throw new BadRequestException('Scope must be from [0, 1]');
    } else {
      if (scope === LeaderboardScope.GLOBAL) {
        if (mode !== undefined) {
          throw new BadRequestException('Game mode is not required!');
        }
      }

      if (scope === LeaderboardScope.MODE) {
        if (mode === undefined) {
          throw new BadRequestException('Game mode is required!');
        } else if (!isObjectIdOrHexString(mode)) {
          throw new BadRequestException('invalid game mode id!');
        }
      }
    }

    if (filter !== undefined && ![0, 1, 2].includes(filter)) {
      throw new BadRequestException('Filter must be from [0, 1, 2]');
    }

    return this.leaderboardService.getLeaderboard(
      scope,
      limit,
      page,
      mode,
      filter,
    );
  }

  @Post('update/score')
  @HttpCode(HttpStatus.CREATED)
  updateScore(
    @Body()
    data: {
      user_id: string;
      scope: number;
      game_mode?: string;
      driftScore: number;
      xp: number;
      isWin: boolean;
    },
  ) {
    if (data.scope === 1 && data.game_mode === undefined) {
      throw new BadRequestException('game node required!');
    }

    return this.leaderboardService.updateTimeBasedLeaderboard(data);
  }
}
