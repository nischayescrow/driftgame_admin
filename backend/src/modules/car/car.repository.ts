import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model } from 'mongoose';
import { Car, CarDocument, CarStatus } from './schemas/car.schema';

@Injectable()
export class CarRepository {
  constructor(
    @InjectModel(Car.name)
    private carModel: Model<CarDocument>,
  ) {}

  private carDocProj = {
    _id: 1,
    name: 1,
    top_speed: 1,
    engine: 1,
    breaking: 1,
    fuel: 1,
    locked: 1,
    unlocked_at_level: 1,
    price_in_key: 1,
    price_in_coin: 1,
    offer_percentage: 1,
    status: 1,
  };

  async create(data: Partial<CarDocument>): Promise<CarDocument> {
    const car = new this.carModel(data);
    return await car.save();
  }

  async findById(
    id: string,
    all: boolean = false,
  ): Promise<CarDocument | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid car id!');
    }

    const findQuery = all
      ? {
          _id: id,
        }
      : {
          _id: id,
          status: CarStatus.ACTIVE,
        };

    return await this.carModel.findOne(findQuery, this.carDocProj);
  }

  async findByName(
    name: string,
    all: boolean = false,
  ): Promise<CarDocument | null> {
    const findQuery = all
      ? {
          name: name,
        }
      : {
          name: name,
          status: CarStatus.ACTIVE,
        };

    return await this.carModel.findOne(findQuery, this.carDocProj);
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 0,
  ): Promise<{ data: CarDocument[]; total: number }> {
    const skip = page * limit;
    const findQuery = {
      $or: [{ name: { $regex: text, $options: 'i' } }],
    };

    const cars = await this.carModel
      .find(findQuery, this.carDocProj)
      .limit(limit)
      .skip(skip);
    const totalCars = await this.carModel.countDocuments(findQuery);

    return {
      data: cars,
      total: totalCars,
    };
  }

  async findAll(
    limit: number = 10,
    page: number = 0,
  ): Promise<{
    data: CarDocument[];
    total: number;
  }> {
    const skip = page * limit;

    const cars = await this.carModel
      .find({}, this.carDocProj)
      .limit(limit)
      .skip(skip);
    const totalCars = await this.carModel.countDocuments({});

    return {
      data: cars,
      total: totalCars,
    };
  }

  async update(
    id: string,
    data: Partial<CarDocument>,
  ): Promise<CarDocument | null> {
    return await this.carModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<CarDocument | null> {
    return await this.carModel.findByIdAndDelete(id);
  }
}
