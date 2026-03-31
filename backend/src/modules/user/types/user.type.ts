import { Types } from 'mongoose';
import { UserAccStatus, UserLiveStatus } from '../schemas/user.schema';

export interface UserProj {
  _id: 0 | 1;
  first_name: 0 | 1;
  last_name: 0 | 1;
  email: 0 | 1;
  password?: 0 | 1;
  email_verified?: 0 | 1;
  picture?: 0 | 1;
  avatar_id?: 0 | 1;
  acc_status?: 0 | 1;
  live_status?: 0 | 1;
  createdAt?: 0 | 1;
  updatedAt?: 0 | 1;
}

export interface findByIdResType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  email_verified?: boolean;
  picture?: string;
  avatar_id?: number;
  totalCoins?: number;
  totalXp?: number;
  acc_status?: UserAccStatus;
  live_status?: UserLiveStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserOnlineStatus {
  OFFLINE = 0,
  ONLINE = 1,
  IN_GAME = 2,
  IN_PRIVATE_ROOM = 3,
}
