import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export enum UserAccStatus {
  BLOCKED = 0,
  ACTIVE = 1,
  DELETED = 2,
}

export enum UserLiveStatus {
  OFFLINE = 0,
  ONLINE = 1,
  IN_GAME = 2,
  IN_PRIVATE_ROOM = 3,
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: true, trim: true })
  first_name: string;

  @Prop({ type: String, required: true, trim: true })
  last_name: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, trim: true, default: null })
  password: string;

  @Prop({ type: Boolean, default: false })
  email_verified: boolean;

  @Prop({ type: String, default: null })
  picture: string;

  @Prop({ type: Number, required: true, default: 0 })
  avatar_id: number;

  @Prop({ type: Number, enum: UserLiveStatus, default: UserLiveStatus.OFFLINE })
  live_status: number;

  @Prop({ type: Number, enum: UserAccStatus, default: UserAccStatus.BLOCKED })
  acc_status: number;

  @Prop({ type: Number, default: 0 })
  totalCoins: number;

  @Prop({ type: Number, default: 0 })
  totalXp: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
