import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { LeaderboardRepository } from './repositories/leaderboard.repository';
import { UserService } from '../user/user.service';
import {
  Leaderboard,
  LeaderboardDocument,
  LeaderboardScope,
  LeaderboardTimeFilters,
} from './schemas/leaderboard.schema';
import { isObjectIdOrHexString } from 'mongoose';
import { GlobalLeaderboardDoc } from './types/leaderboard.type';
import { GamemodeService } from '../gamemode/gamemode.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.constant';
import { randomUUID } from 'crypto';

@Injectable()
export class LeaderboardService {
  constructor(
    @Inject(REDIS_CLIENT) private redis: Redis,
    private readonly leaderboardRepo: LeaderboardRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly gameModeService: GamemodeService,
  ) {}

  async findById(id: string) {
    try {
      const isObjectId = isObjectIdOrHexString(id);

      if (!isObjectId) {
        throw new BadRequestException('Invalid id!');
      }

      const findLeaderboard = await this.leaderboardRepo.findById(id);

      // console.log('findById', findLeaderboard);

      if (!findLeaderboard) {
        throw new NotFoundException('Leaderboard do not found!');
      }

      const data: Partial<LeaderboardDocument> & { id: string } = {
        id: findLeaderboard.id,
        user_id: findLeaderboard.user_id,
        scope: findLeaderboard.scope,
        game_mode: findLeaderboard.game_mode,
        totalDriftScore: findLeaderboard.totalDriftScore,
        totalXp: findLeaderboard.totalXp,
        matchesPlayed: findLeaderboard.matchesPlayed,
        wins: findLeaderboard.wins,
        leaderboardScore: findLeaderboard.leaderboardScore,
        createdAt: findLeaderboard.createdAt,
        updatedAt: findLeaderboard.updatedAt,
      };

      return {
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByUserId(user_id: string, scope: number, game_mode?: string) {
    try {
      if (!isObjectIdOrHexString(user_id)) {
        throw new BadRequestException('Invalid user id!');
      }

      if (game_mode !== undefined && !isObjectIdOrHexString(game_mode)) {
        throw new BadRequestException('Invalid user game mode!');
      }

      const findUser = await this.userService.findById(user_id);

      // console.log('findByUserId-findUser: ', findUser);

      if (!findUser || !findUser.data) {
        throw new NotFoundException('User do not found!');
      }

      const findLeaderboard = await this.leaderboardRepo.findByUserId(
        findUser.data.id,
        scope,
        game_mode,
      );

      // console.log('findById', findLeaderboard);

      if (!findLeaderboard) {
        throw new NotFoundException('Leaderboard do not found!');
      }

      const data: Partial<LeaderboardDocument> & { id: string } = {
        id: findLeaderboard.id,
        user_id: findLeaderboard.user_id,
        scope: findLeaderboard.scope,
        game_mode: findLeaderboard.game_mode,
        totalDriftScore: findLeaderboard.totalDriftScore,
        totalXp: findLeaderboard.totalXp,
        matchesPlayed: findLeaderboard.matchesPlayed,
        wins: findLeaderboard.wins,
        leaderboardScore: findLeaderboard.leaderboardScore,
        createdAt: findLeaderboard.createdAt,
        updatedAt: findLeaderboard.updatedAt,
      };

      return {
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createLeaderboardDto: CreateLeaderboardDto) {
    try {
      const isObjectId = isObjectIdOrHexString(createLeaderboardDto.user_id);

      if (!isObjectId) {
        throw new BadRequestException('Invalid user user_id!');
      }

      const findUser = await this.userService.findById(
        createLeaderboardDto.user_id,
        true,
      );

      // console.log('findByUserId-findUser: ', findUser);

      if (!findUser || !findUser.data) {
        throw new NotFoundException('User do not found!');
      }

      if (
        createLeaderboardDto.scope !== LeaderboardScope.GLOBAL &&
        createLeaderboardDto.game_mode === undefined
      ) {
        throw new BadRequestException('Game mode is required!');
      }

      if (
        createLeaderboardDto.scope === LeaderboardScope.GLOBAL &&
        createLeaderboardDto.game_mode !== undefined
      ) {
        throw new BadRequestException('Global scope do not require game mode!');
      }

      const findLeaderboard = await this.leaderboardRepo.findByUserId(
        createLeaderboardDto.user_id,
        createLeaderboardDto.scope,
        createLeaderboardDto.game_mode,
      );

      console.log('findLeaderboard: ', findLeaderboard);

      if (findLeaderboard) {
        throw new BadRequestException(
          'User already have Leaderboard with given scope or game mode!',
        );
      }

      await this.leaderboardRepo.create(createLeaderboardDto);

      return {
        message: 'Leaderboard Record created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updateLeaderboardDto: UpdateLeaderboardDto) {
    try {
      const findDoc = await this.findById(id);

      await this.leaderboardRepo.update(id, updateLeaderboardDto);

      return {
        status: true,
        message: 'Leaderboard Record updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      const isObjectId = isObjectIdOrHexString(id);

      if (!isObjectId) {
        throw new BadRequestException('Invalid id!');
      }

      await this.findById(id);

      // console.log('UpdateId: ', id);

      await this.leaderboardRepo.delete(id);

      return {
        message: 'Leaderboard Record deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getLeaderboard(
    scope: number,
    limit: number,
    page: number,
    mode?: string,
    filter?: LeaderboardTimeFilters,
  ) {
    let leaderBoard: {
      data: LeaderboardDocument[] | Partial<LeaderboardDocument>[];
      total: number;
    } = {
      data: [],
      total: 0,
    };

    if (filter !== undefined) {
      // From redis

      const redisData = await this.getTimeBasedLeaderboard(
        scope,
        filter,
        limit,
        page,
        mode,
      );

      console.log('redisData: ', redisData);

      leaderBoard = redisData;
    } else {
      // From mongoDB
      if (scope === 0) {
        leaderBoard = await this.leaderboardRepo.getLeaderboard(
          scope,
          limit,
          page,
        );
      } else if (scope === 1) {
        if (mode) await this.gameModeService.findById(mode);

        leaderBoard = await this.leaderboardRepo.getLeaderboard(
          scope,
          limit,
          page,
          mode,
        );
      }
    }

    if (!leaderBoard || leaderBoard.data.length <= 0) {
      throw new NotFoundException('Leaderboard has no records!');
    }

    if (leaderBoard && leaderBoard.data.length > 0) {
      const data: GlobalLeaderboardDoc[] = await Promise.all(
        leaderBoard.data.map(async (doc: LeaderboardDocument, inx: number) => {
          const findUser = await this.userService.findById(
            String(doc.user_id),
            true,
          );

          if (!findUser || !findUser.data) {
            console.log(String(doc.user_id));
            throw new BadRequestException('User do not found!');
          }

          return {
            id: doc.id,
            rank: (page - 1) * limit + inx + 1,
            user_id: doc.user_id,
            first_name: findUser.data.first_name,
            last_name: findUser.data.last_name,
            email: findUser.data.email,
            picture: findUser.data.picture,
            avatar_id: findUser.data.avatar_id,
            totalDriftScore: doc.totalDriftScore,
            totalXp: doc.totalXp,
            matchesPlayed: doc.matchesPlayed,
            wins: doc.wins,
            leaderboardScore: doc.leaderboardScore,
          };
        }),
      );

      return {
        total: leaderBoard.total,
        data,
        limit,
        page,
      };
    }
  }

  // text seed functions
  async updateTimeBasedLeaderboard(data: {
    user_id: string;
    scope: number;
    driftScore: number;
    xp: number;
    isWin: boolean;
    game_mode?: string;
  }) {
    const players: {
      user_id: string;
      scope: number;
      driftScore: number;
      xp: number;
      isWin: boolean;
      game_mode?: string;
    }[] = [
      {
        user_id: '69cb876467bca6e1e863a1d5',
        scope: 0,
        driftScore: 0,
        xp: 0,
        isWin: true,
      },
      {
        user_id: '69cb9971ffaac68d5fcb62b3',
        scope: 0,
        driftScore: 0,
        xp: 0,
        isWin: false,
      },
    ];

    await Promise.all(
      players.map(async (pl) => {
        await Promise.all(
          // ['daily', 'weekly', 'monthly'].map(async (flt) => {
          [
            'daily',
            'weekly',
            'weekly',
            'monthly',
            'monthly',
            'monthly',
            'monthly',
          ].map(async (flt) => {
            const scoreKey = `leaderBoard:${pl.scope}${pl.game_mode ? `:${pl.game_mode}` : ''}:${flt}:score`;
            const statsKey = `leaderBoard:${pl.scope}${pl.game_mode ? `:${pl.game_mode}` : ''}:${flt}:stats:${pl.user_id}`;

            console.log('scoreKey: ', scoreKey);
            console.log('statsKey: ', statsKey);

            const newScore =
              pl.driftScore * 1.0 + (pl.isWin ? 800 : 0) + pl.xp * 0.3 + 10;

            console.log('newScore: ', newScore);

            await this.redis.hincrby(
              statsKey,
              `totalDriftScore`,
              pl.driftScore,
            );

            await this.redis.hincrby(statsKey, 'totalXp', pl.xp);

            await this.redis.hincrby(statsKey, `matchesPlayed`, 1);

            if (pl.isWin) {
              await this.redis.hincrby(statsKey, `wins`, 1);
            } else {
              await this.redis.hincrby(statsKey, `wins`, 0);
            }

            const updatedScore = await this.redis.hincrby(
              statsKey,
              `leaderboardScore`,
              newScore,
            );
            console.log('updatedScore: ', updatedScore);

            await this.redis.zadd(scoreKey, updatedScore, pl.user_id);
          }),
        );
      }),
    );

    return { ok: true };
  }

  async getTimeBasedLeaderboard(
    scope: number,
    filter: LeaderboardTimeFilters,
    limit: number,
    page: number,
    game_mode?: string,
  ) {
    const FILTERS = ['daily', 'weekly', 'monthly'];

    const scoreKey = `leaderBoard:${scope}${game_mode ? `:${game_mode}` : ''}:${FILTERS[filter]}:score`;
    const statsKey = `leaderBoard:${scope}${game_mode ? `:${game_mode}` : ''}:${FILTERS[filter]}:stats`;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    console.log('scoreKey', scoreKey);

    const totalPlayers = await this.redis.zcard(scoreKey);

    const players = await this.redis.zrevrange(
      scoreKey,
      start,
      end,
      'WITHSCORES',
    );

    const data: Partial<LeaderboardDocument>[] = [];

    for (let i = 0; i < players.length; i += 2) {
      const playerStat = await this.redis.hgetall(`${statsKey}:${players[i]}`);
      const plData: Record<string, string | number> = {
        user_id: players[i],
      };

      Object.keys(playerStat).map((key) => {
        plData[key] = parseFloat(playerStat[key]);
      });

      data.push(plData);
    }

    return { data, total: totalPlayers };
  }

  async updateTimeBasedLeaderboardByUser(
    user_id: string,
    data: {
      scope: number;
      filter?: LeaderboardTimeFilters;
      driftScore: number;
      xp: number;
      game_mode?: string;
    },
  ) {
    const scoreKey = `leaderBoard:${data.scope}${data.game_mode ? `:${data.game_mode}` : ''}:${data.filter}:score`;
    const statsKey = `leaderBoard:${data.scope}${data.game_mode ? `:${data.game_mode}` : ''}:${data.filter}:stats:${user_id}`;

    console.log('scoreKey: ', scoreKey);
    console.log('statsKey: ', statsKey);

    await this.redis.hincrby(statsKey, `totalDriftScore`, data.driftScore);

    await this.redis.hincrby(statsKey, 'totalXp', data.xp);

    const updatedScore = await this.redis.hincrby(
      statsKey,
      `leaderboardScore`,
      data.driftScore,
    );

    console.log('updatedScore: ', updatedScore);

    await this.redis.zadd(scoreKey, updatedScore, user_id);

    return { ok: true };
  }
}
