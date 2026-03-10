import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum PlayerLevelStatus {
  NOTACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

@Schema({
  collection: 'playerLevels',
  timestamps: true,
})
export class PlayerLevel {
  @Prop({ type: Number, required: true, unique: true, trim: true })
  level: number;

  @Prop({ type: Number, required: true, trim: true })
  xpToLevel: number;

  @Prop({ type: String, required: true, trim: true })
  displayName: string;

  @Prop({
    type: Number,
    enum: PlayerLevelStatus,
    default: PlayerLevelStatus.NOTACTIVE,
  })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type PlayerLevelDocument = HydratedDocument<PlayerLevel>;
export const PlayerLevelSchema = SchemaFactory.createForClass(PlayerLevel);
