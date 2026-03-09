import { User, UserDocument, UserStatus } from '../../user/schemas/user.schema';
import { Session, SessionDocument } from '../schemas/session.schema';

export interface LoginUserRes {
  message: string;
  session: string;
  user: Partial<UserDocument>;
  access_token: string;
  refresh_token: string;
}

export interface verifySessionRes {
  session: SessionDocument;
  user: UserDocument;
}
