import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model } from 'mongoose';
import { PlayerLevel, PlayerLevelDocument } from './schemas/playerLevel.schema';

@Injectable()
export class PlayerLevelRepository {
  constructor(
    @InjectModel(PlayerLevel.name)
    private plLevelModel: Model<PlayerLevelDocument>,
  ) {}

  async create(
    data: Partial<PlayerLevelDocument>,
  ): Promise<PlayerLevelDocument> {
    const playerLevel = new this.plLevelModel(data);
    return await playerLevel.save();
  }

  async findById(id: string): Promise<PlayerLevelDocument | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid user id!');
    }

    // console.log('findById: ', id);

    return await this.plLevelModel.findOne({
      _id: id,
    });
  }

  async findByLevelNo(no: number): Promise<PlayerLevelDocument | null> {
    // console.log('findById: ', id);

    return await this.plLevelModel.findOne({
      level: no,
    });
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 0,
  ): Promise<{ data: PlayerLevelDocument[]; total: number }> {
    const skip = page * limit;
    const findQuery = {
      $or: [{ displayName: { $regex: text, $options: 'i' } }],
    };

    const playerLevels = await this.plLevelModel
      .find(findQuery)
      .limit(limit)
      .skip(skip);
    const totalPlLevels = await this.plLevelModel.countDocuments(findQuery);

    return {
      data: playerLevels,
      total: totalPlLevels,
    };
  }

  async findAll(
    limit: number = 10,
    page: number = 0,
  ): Promise<{
    data: PlayerLevelDocument[];
    total: number;
  }> {
    const skip = page * limit;

    const playerLevels = await this.plLevelModel
      .find({})
      .limit(limit)
      .skip(skip);
    const totalPlLevels = await this.plLevelModel.countDocuments({});

    return {
      data: playerLevels,
      total: totalPlLevels,
    };
  }

  async update(
    id: string,
    data: Partial<PlayerLevelDocument>,
  ): Promise<PlayerLevelDocument | null> {
    return await this.plLevelModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<PlayerLevelDocument | null> {
    return await this.plLevelModel.findByIdAndDelete(id);
  }
}
