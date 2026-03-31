import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model } from 'mongoose';
import {
  Leaderboard,
  LeaderboardDocument,
  LeaderboardScope,
  LeaderboardTimeFilters,
} from '../schemas/leaderboard.schema';
import { CreateLeaderboardDto } from '../dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from '../dto/update-leaderboard.dto';

@Injectable()
export class LeaderboardRepository {
  constructor(
    @InjectModel(Leaderboard.name)
    private leaderboardModel: Model<LeaderboardDocument>,
  ) {}

  async create(data: CreateLeaderboardDto): Promise<LeaderboardDocument> {
    const leaderboard = new this.leaderboardModel(data);

    // leaderboard.leaderboardScore =
    //   leaderboard.totalDriftScore * 1.0 +
    //   leaderboard.wins * 800 +
    //   leaderboard.totalXp * 0.3 +
    //   leaderboard.matchesPlayed * 10;

    leaderboard.leaderboardScore = leaderboard.totalDriftScore;

    // const findQuery =
    //   data.game_mode && data.game_mode.length > 0
    //     ? {
    //         scope: leaderboard.scope,
    //         game_mode: data.game_mode,
    //         leaderboardScore: { $gt: { value: leaderboard.leaderboardScore } },
    //       }
    //     : {
    //         scope: leaderboard.scope,
    //         leaderboardScore: { $gt: { value: leaderboard.leaderboardScore } },
    //       };

    // const findPlayerAboveMe = await this.leaderboardModel.countDocuments({
    //   where: findQuery,
    // });

    // console.log('findPlayerAboveMe: ', findPlayerAboveMe);

    // leaderboard.rank = findPlayerAboveMe + 1;

    return await leaderboard.save();
  }

  async findByUserId(
    user_id: string,
    scope: LeaderboardScope,
    game_mode?: string,
  ): Promise<LeaderboardDocument | null> {
    const findQuery =
      game_mode && game_mode.length > 0
        ? {
            user_id,
            scope,
            game_mode,
          }
        : {
            user_id,
            scope,
          };

    const findLeaderboard = await this.leaderboardModel.findOne(findQuery);

    return findLeaderboard;
  }

  async findById(id: string): Promise<LeaderboardDocument | null> {
    if (!isObjectIdOrHexString(id)) {
      throw new BadRequestException('Invalid Leaderboard document id!');
    }

    const findLeaderboard = await this.leaderboardModel.findOne({ _id: id });

    if (!findLeaderboard) {
      throw new NotFoundException('Leaderboard document do not found!');
    }

    return findLeaderboard;
  }

  async update(
    id: string,
    data: UpdateLeaderboardDto,
  ): Promise<LeaderboardDocument | null> {
    for (let key of Object.keys(data)) {
      if (data[key] === undefined) {
        delete data[key];
      }
    }

    // console.log('data: ', data);

    let findLeaderboardDoc = (await this.findById(id)) as LeaderboardDocument;

    // console.log('findLeaderboardDoc: ', findLeaderboardDoc);

    // console.log('Old score: ', findLeaderboardDoc.leaderboardScore);

    findLeaderboardDoc = Object.assign(findLeaderboardDoc, data);

    // console.log('updatedData: ', findLeaderboardDoc);

    // const newScore =
    //   findLeaderboardDoc.totalDriftScore * 1.0 +
    //   findLeaderboardDoc.wins * 800 +
    //   findLeaderboardDoc.totalXp * 0.3 +
    //   findLeaderboardDoc.matchesPlayed * 10;

    const newScore = findLeaderboardDoc.totalDriftScore;

    // console.log('New score: ', newScore);

    const updatedLeaderboardDoc = await this.leaderboardModel.findByIdAndUpdate(
      id,
      {
        leaderboardScore: newScore,
        ...data,
      },
      { returnDocument: 'after' },
    );

    // console.log('updatedLeaderboardDoc: ', updatedLeaderboardDoc);

    return updatedLeaderboardDoc;
  }

  async delete(id: string): Promise<LeaderboardDocument | null> {
    return await this.leaderboardModel.findByIdAndDelete(id);
  }

  async getLeaderboard(
    scope: number,
    limit: number = 5,
    page: number = 1,
    mode?: string,
  ): Promise<{ data: LeaderboardDocument[]; total: number }> {
    const skip = page * limit;

    const findQuery =
      mode !== undefined
        ? {
            scope,
            game_mode: mode,
          }
        : {
            scope,
          };

    const findDocs = await this.leaderboardModel
      .find(findQuery)
      .sort({ leaderboardScore: -1 })
      .limit(limit)
      .skip(skip);

    const totalDocs = await this.leaderboardModel.countDocuments(findQuery);

    return {
      data: findDocs,
      total: totalDocs,
    };
  }
}
