import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isObjectIdOrHexString, Model } from 'mongoose';
import {
  ClientConfig,
  ClientConfigDocument,
} from '../schemas/client-config.schema';
import { ClientConfigProj } from '../types/client-config.type';
import { UpdateClientConfigDto } from '../dto/update-config.dto';

@Injectable()
export class ClientConfigRepository {
  constructor(
    @InjectModel(ClientConfig.name)
    private clientConfigModel: Model<ClientConfigDocument>,
  ) {}

  async create(
    data: Partial<ClientConfigDocument>,
  ): Promise<ClientConfigDocument> {
    const config = new this.clientConfigModel(data);
    return await config.save();
  }

  async findByBuildVer(version: number): Promise<ClientConfigDocument | null> {
    return this.clientConfigModel.findOne({ clientBuildVersion: version });
  }

  async findById(id: string): Promise<ClientConfigDocument | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    // console.log('findById: ', id);

    return await this.clientConfigModel.findOne({ _id: id });
  }

  async findAll(): Promise<ClientConfigDocument[]> {
    return await this.clientConfigModel.find({});
  }

  async update(
    id: string,
    data: UpdateClientConfigDto,
  ): Promise<UpdateClientConfigDto | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    return await this.clientConfigModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    });
  }

  async delete(id: string): Promise<ClientConfigDocument | null> {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    return await this.clientConfigModel.findByIdAndDelete(id);
  }
}
