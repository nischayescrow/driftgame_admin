import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';

export enum LeaderboardScope {
  GLOBAL = 0,
  MODE = 1,
}

export enum LeaderboardTimeFilters {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
}

@Schema({
  collection: 'leaderboard',
  timestamps: true,
})
export class Leaderboard {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    require: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: Number,
    enum: LeaderboardScope,
    default: LeaderboardScope.GLOBAL,
  })
  scope: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'GameMode',
    required: false,
  })
  game_mode?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalDriftScore: number;

  @Prop({ type: Number, default: 0 })
  totalXp: number;

  @Prop({ type: Number, default: 0 })
  matchesPlayed: number;

  @Prop({ type: Number, default: 0 })
  wins: number;

  @Prop({ type: Number, default: 0 })
  leaderboardScore: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type LeaderboardDocument = HydratedDocument<Leaderboard>;

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard);
