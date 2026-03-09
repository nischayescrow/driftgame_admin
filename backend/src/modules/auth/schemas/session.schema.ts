import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum SessionStatus {
  NOTACTIVE = 0,
  ACTIVE = 1,
  BLOCKED = 2,
  LOGOUT = 3,
}

@Schema({
  timestamps: true,
})
export class Session {
  @Prop({ type: String, required: true })
  user_id: string;

  @Prop({
    type: Number,
    enum: SessionStatus,
    default: SessionStatus.NOTACTIVE,
  })
  status: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);
