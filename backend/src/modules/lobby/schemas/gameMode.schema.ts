import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export enum GameModeStatus {
  NOTACTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

@Schema({
  collection: 'gameModes',
  timestamps: true,
})
export class GameMode {
  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  identity: string;

  @Prop({ type: String, required: true, trim: true })
  purpose: string;

  @Prop({ type: String, required: false, trim: true })
  map: string;

  @Prop({ type: Number, required: true })
  players: number;

  @Prop({
    type: Number,
    enum: GameModeStatus,
    default: GameModeStatus.NOTACTIVE,
  })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type GameModeDocument = HydratedDocument<GameMode>;
export const GameModeSchema = SchemaFactory.createForClass(GameMode);
