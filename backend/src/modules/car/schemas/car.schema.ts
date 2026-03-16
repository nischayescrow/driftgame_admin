import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum CarLockedStatus {
  LOCKED = 0,
  UNLOCKED = 1,
}

export enum CarStatus {
  NOTCTIVE = 0,
  ACTIVE = 1,
  DELETED = 2,
}

@Schema({
  collection: 'cars',
  timestamps: true,
})
export class Car {
  @Prop({ type: String, required: true, unique: true, trim: true })
  name: string;

  @Prop({ type: Number, required: true })
  top_speed: number;

  @Prop({ type: Number, required: true })
  engine: number;

  @Prop({ type: Number, required: true })
  breaking: number;

  @Prop({ type: Number, required: true })
  fuel: number;

  @Prop({
    type: Number,
    enum: CarLockedStatus,
    default: CarLockedStatus.LOCKED,
  })
  locked: number;

  @Prop({ type: Number, required: true })
  unlocked_at_level: number;

  @Prop({ type: Number, required: true })
  price_in_key: number;

  @Prop({ type: Number, required: true })
  price_in_coin: number;

  @Prop({ type: Number, required: true })
  offer_percentage: number;

  @Prop({
    type: Number,
    enum: CarStatus,
    default: CarStatus.ACTIVE,
  })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type CarDocument = HydratedDocument<Car>;
export const CarSchema = SchemaFactory.createForClass(Car);
