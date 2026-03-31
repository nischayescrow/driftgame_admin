import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model, Types } from 'mongoose';
import { User, UserAccStatus, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return await user.save();
  }

  async findByEmail(email: string, all: boolean = false) {
    const findQuery = all
      ? {
          $and: [{ email }],
        }
      : {
          $and: [{ email }, { acc_status: UserAccStatus.ACTIVE }],
        };

    const findUser = await this.userModel.findOne(findQuery);

    if (!findUser) {
      return null;
    }

    return findUser;
  }

  async findById(id: string, all: boolean = false) {
    const findQuery = all
      ? {
          _id: id,
        }
      : {
          $and: [{ _id: id }, { acc_status: UserAccStatus.ACTIVE }],
        };

    const findUser = await this.userModel.findOne(findQuery);

    if (!findUser) {
      return null;
    }

    return findUser;
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 0,
    all: boolean = false,
  ): Promise<{ users: UserDocument[]; total: number }> {
    const findQuery = all
      ? {
          $or: [
            { first_name: { $regex: text, $options: 'i' } },
            { last_name: { $regex: text, $options: 'i' } },
            { email: { $regex: text, $options: 'i' } },
          ],
        }
      : {
          $and: [
            {
              $or: [
                { first_name: { $regex: text, $options: 'i' } },
                { last_name: { $regex: text, $options: 'i' } },
                { email: { $regex: text, $options: 'i' } },
              ],
            },
            { acc_status: UserAccStatus.ACTIVE },
          ],
        };

    const skip = page * limit;
    const totalUsers = await this.userModel.countDocuments(findQuery);

    return {
      users: await this.userModel.find(findQuery).limit(limit).skip(skip),
      total: totalUsers,
    };
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find();
  }

  async update(
    id: string,
    data: Partial<UserDocument>,
  ): Promise<UserDocument | null> {
    console.log('id', id, 'data: ', data);

    return await this.userModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    });
  }

  async delete(id: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndDelete(id);
  }
}
