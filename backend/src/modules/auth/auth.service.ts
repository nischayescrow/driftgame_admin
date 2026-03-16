import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { TokenService } from './token.service';
import {
  LoginUserRes,
  SessionHash,
  SessionStatus,
  verifySessionRes,
} from './types/auth.type';
import { User, UserDocument, UserStatus } from '../user/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailLoginDto } from './dto/emailLogin.dto';
import * as bcrypt from 'bcrypt';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  async verifySession(
    session_id: string,
    user_id: string,
  ): Promise<verifySessionRes | null> {
    try {
      const findSession = (await this.redis.hgetall(
        `sessions:${user_id}`,
      )) as unknown as SessionHash;

      // console.log('findSession: ', findSession);

      if (
        !findSession ||
        findSession.session_id !== session_id ||
        Number(findSession.status) !== SessionStatus.ACTIVE
      ) {
        return null;
      }

      const findUser = await this.userService.findById(findSession.user_id);

      if (!findUser) {
        return null;
      }

      return {
        session: findSession,
        user: findUser,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async singupWithEmail(createUserDto: CreateUserDto) {
    try {
      // Create user
      const createUserRes = await this.userService.create(createUserDto);

      // console.log('createUserRes: ', createUserRes);

      return {
        message: 'You have signed up successfully',
      };
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async loginWithEmail(emailLoginDto: EmailLoginDto): Promise<LoginUserRes> {
    try {
      const findUser = await this.userService.findByEmail(
        emailLoginDto.email,
        true,
        true,
      );

      if (!findUser) {
        throw new UnauthorizedException('Incorrect credentials!');
      }

      if (findUser.status !== UserStatus.ACTIVE) {
        switch (findUser.status) {
          case UserStatus.BLOCKED: {
            throw new BadRequestException('User account is blocked');
          }

          case UserStatus.DELETED: {
            throw new BadRequestException('User do not found');
          }

          case UserStatus.NOTACTIVE: {
            throw new BadRequestException('User account is not active');
          }
        }
      }

      if (!findUser.password) {
        throw new BadRequestException('User have not set any password!');
      }

      // check password here
      const isMatch = await bcrypt.compare(
        emailLoginDto.password,
        findUser.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Incorrect credentials!');
      }

      // const createSession = await this.createSession(findUser.id);
      const createdSession = randomUUID();

      const access_token = await this.tokenService.signAccessToken({
        session_id: createdSession,
        user_id: findUser.id,
      });

      const refresh_token = await this.tokenService.signRefreshToken({
        session_id: createdSession,
        user_id: findUser.id,
      });

      const refresh_token_expires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      );

      const refresh_token_hashed = await bcrypt.hash(refresh_token, 10);

      await this.redis.hset(`sessions:${findUser.id}`, {
        session_id: createdSession,
        user_id: findUser.id,
        hashedToken: refresh_token_hashed,
        status: SessionStatus.ACTIVE,
        createdAt: Date.now(),
        expiresAt: refresh_token_expires,
      });

      await this.redis.pexpire(
        `sessions:${findUser.id}`,
        7 * 24 * 60 * 60 * 1000,
      );

      return {
        message: 'You have logged in successfully',
        session: createdSession,
        user: {
          first_name: findUser.first_name,
          last_name: findUser.last_name,
          email: findUser.email,
          email_verified: findUser.email_verified,
          picture: findUser.picture,
          status: findUser.status,
          friends: findUser.friends,
          sentFriendRequests: findUser.sentFriendRequests,
          receviedFriendRequests: findUser.receviedFriendRequests,
          id: findUser.id,
          createdAt: findUser.createdAt,
          updatedAt: findUser.updatedAt,
        },
        access_token,
        refresh_token,
      };
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async logout(user_id: string) {
    try {
      await this.redis.del(`sessions:${user_id}`);

      return {
        message: 'User logout successfully',
      };
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async refreshToken(refresh_token: string) {
    const refreshTokenDecoded =
      await this.tokenService.verifyRefreshToken(refresh_token);

    if (
      !refreshTokenDecoded ||
      !refreshTokenDecoded.user_id ||
      !refreshTokenDecoded.session_id
    ) {
      throw new UnauthorizedException('Session expired, Please login again!');
    }

    const userData = await this.verifySession(
      refreshTokenDecoded.session_id,
      refreshTokenDecoded.user_id,
    );

    // console.log('userData: ', userData);

    if (!userData) {
      throw new UnauthorizedException('No active session, please login again!');
    }

    const new_access_token = await this.tokenService.signAccessToken({
      session_id: userData.session.session_id,
      user_id: userData.user.id,
    });

    const new_refresh_token = await this.tokenService.signRefreshToken({
      session_id: userData.session.session_id,
      user_id: userData.user.id,
    });

    const new_refresh_token_hashed = await bcrypt.hash(new_refresh_token, 10);

    const new_refresh_token_expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    await this.redis.hset(`sessions:${userData.user.id}`, {
      session_id: userData.session.session_id,
      user_id: userData.user.id,
      hashedToken: new_refresh_token_hashed,
      status: SessionStatus.ACTIVE,
      createdAt: Date.now(),
      expiresAt: new_refresh_token_expires,
    });

    await this.redis.pexpire(
      `sessions:${userData.user.id}`,
      7 * 24 * 60 * 60 * 1000,
    );

    return {
      message: 'You have logged in successfully',
      user: {
        first_name: userData.user.first_name,
        last_name: userData.user.last_name,
        email: userData.user.email,
        email_verified: userData.user.email_verified,
        picture: userData.user.picture,
        status: userData.user.status,
        friends: userData.user.friends,
        sentFriendRequests: userData.user.sentFriendRequests,
        receviedFriendRequests: userData.user.receviedFriendRequests,
        id: userData.user.id,
        createdAt: userData.user.createdAt,
        updatedAt: userData.user.updatedAt,
      },
      access_token: new_access_token,
      refresh_token: new_refresh_token,
    };
  }
}
