import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(data: Partial<SessionDocument>): Promise<SessionDocument> {
    const session = new this.sessionModel(data);
    return await session.save();
  }

  async findByEmail(email: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ email });
  }

  async findById(id: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findById(id);
  }

  async findAll(): Promise<SessionDocument[]> {
    return await this.sessionModel.find();
  }

  async update(
    id: string,
    data: Partial<SessionDocument>,
  ): Promise<SessionDocument | null> {
    return await this.sessionModel.findByIdAndUpdate(id, data);
  }

  async delete(id: string): Promise<SessionDocument | null> {
    return await this.sessionModel.findByIdAndDelete(id);
  }
}
