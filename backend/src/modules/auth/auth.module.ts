import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './schemas/session.schema';
import { TokenService } from './token.service';
import { SessionRepository } from './repositories/session.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, SessionRepository],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
