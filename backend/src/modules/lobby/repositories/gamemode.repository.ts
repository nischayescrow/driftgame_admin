import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model } from 'mongoose';
import {
  GameMode,
  GameModeDocument,
  GameModeStatus,
} from '../schemas/gameMode.schema';
import { GameModeProj } from '../types/lobby.type';

@Injectable()
export class GameModeRepository {
  constructor(
    @InjectModel(GameMode.name)
    private gameModeModel: Model<GameModeDocument>,
  ) {}

  async create(data: Partial<GameModeDocument>): Promise<GameModeDocument> {
    const gameMode = new this.gameModeModel(data);
    return await gameMode.save();
  }

  async findById(
    id: string,
    all: boolean,
    gameModeProj: GameModeProj,
  ): Promise<GameModeDocument | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid user id!');
    }

    // console.log('findById: ', id);

    const findQuery = all
      ? {
          _id: id,
        }
      : {
          _id: id,
          status: GameModeStatus.ACTIVE,
        };

    return await this.gameModeModel.findOne(findQuery, gameModeProj);
  }

  async findByName(
    name: string,
    all: boolean = false,
    gameModeProj: GameModeProj,
  ): Promise<GameModeDocument[] | null> {
    // console.log('findByName: ', name);

    const findQuery = all
      ? {
          name,
        }
      : {
          name,
          status: GameModeStatus.ACTIVE,
        };

    return await this.gameModeModel.find(findQuery, gameModeProj);
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 0,
    all: boolean = false,
    gameModeProj: GameModeProj,
  ): Promise<{ modes: GameModeDocument[]; total: number }> {
    const findQuery = all
      ? {
          $or: [
            { name: { $regex: text, $options: 'i' } },
            { identity: { $regex: text, $options: 'i' } },
            { purpose: { $regex: text, $options: 'i' } },
            { map: { $regex: text, $options: 'i' } },
          ],
        }
      : {
          $and: [
            {
              $or: [
                { name: { $regex: text, $options: 'i' } },
                { identity: { $regex: text, $options: 'i' } },
                { purpose: { $regex: text, $options: 'i' } },
                { map: { $regex: text, $options: 'i' } },
              ],
            },
            { status: GameModeStatus.ACTIVE },
          ],
        };

    const skip = page * limit;
    const totalModes = await this.gameModeModel.countDocuments(findQuery);

    return {
      modes: await this.gameModeModel
        .find(findQuery, gameModeProj)
        .limit(limit)
        .skip(skip),
      total: totalModes,
    };
  }

  async findAll(
    limit: number = 10,
    page: number = 0,
    all: boolean = false,
    gameModeProj: GameModeProj,
  ): Promise<{
    modes: GameModeDocument[];
    total: number;
  }> {
    const findQuery = all
      ? {}
      : {
          status: GameModeStatus.ACTIVE,
        };

    const skip = page * limit;
    const totalModes = await this.gameModeModel.countDocuments(findQuery);

    return {
      modes: await this.gameModeModel
        .find(findQuery, gameModeProj)
        .limit(limit)
        .skip(skip),
      total: totalModes,
    };
  }

  async update(
    id: string,
    data: Partial<GameModeDocument>,
  ): Promise<GameModeDocument | null> {
    return await this.gameModeModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<GameModeDocument | null> {
    return await this.gameModeModel.findByIdAndDelete(id);
  }
}
