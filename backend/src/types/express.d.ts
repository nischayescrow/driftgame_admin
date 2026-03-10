import * as express from 'express';
import { SessionDocument } from 'src/modules/auth/schemas/session.schema';
import { SessionHash } from 'src/modules/auth/types/auth.type';
import { UserDocument } from 'src/modules/user/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      session?: SessionHash;
    }
  }
}
