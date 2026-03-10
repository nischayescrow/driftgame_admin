import { UserDocument } from '../../user/schemas/user.schema';

export interface LoginUserRes {
  message: string;
  session: string;
  user: Partial<UserDocument>;
  access_token: string;
  refresh_token: string;
}

export interface verifySessionRes {
  session: SessionHash;
  user: UserDocument;
}

export interface SessionHash {
  session_id: string;
  user_id: string;
  hashedToken: string;
  status: number;
  createdAt: number;
}

export interface TokenPayloadType {
  user_id: string;
  session_id: string;
}

export enum SessionStatus {
  NOTACTIVE = 0,
  ACTIVE = 1,
  BLOCKED = 2,
  LOGOUT = 3,
}
