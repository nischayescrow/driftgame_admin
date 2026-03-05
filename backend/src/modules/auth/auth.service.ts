import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { SessionStatus } from './schemas/session.schema';
import { TokenService } from './token.service';
import { LoginUserRes, verifySessionRes } from './types/auth.type';
import { User, UserStatus } from '../user/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailLoginDto } from './dto/emailLogin.dto';
import * as bcrypt from 'bcrypt';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import { SessionRepository } from './repositories/session.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionRepo: SessionRepository,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  async getUserDataGoogle(authCode: string) {
    const googleAccessTokenPayload = {
      code: authCode,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
    };

    try {
      // Exchange Auth-code with Access_token
      const googleAccessTokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',
        googleAccessTokenPayload,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log('googleAccessTokenRes: ', googleAccessTokenRes.data);

      if (
        !googleAccessTokenRes.data ||
        !googleAccessTokenRes.data.access_token
      ) {
        throw new InternalServerErrorException('Failed to login with google!');
      }

      // Get Userinfo from google
      const UserInfoRes = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessTokenRes.data.access_token}`,
          },
        },
      );

      if (!UserInfoRes.data || !UserInfoRes.data.email) {
        throw new InternalServerErrorException('Failed to login with google!');
      }

      console.log('UserInfoRes: ', UserInfoRes.data);

      return UserInfoRes.data;
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async createSession(user_id: string) {
    return await this.sessionRepo.create({
      user_id,
      status: SessionStatus.ACTIVE,
    });
  }

  async verifySession(session_id: string): Promise<verifySessionRes | null> {
    try {
      const findSession = await this.sessionRepo.findById(session_id);

      // console.log('findSession: ', findSession);

      if (!findSession || findSession.status !== SessionStatus.ACTIVE) {
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

      console.log('createUserRes: ', createUserRes);

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

      const createSession = await this.createSession(findUser.id);

      const access_token = await this.tokenService.signAccessToken({
        sub: {
          session_id: createSession.id,
        },
      });

      const refresh_token = await this.tokenService.signRefreshToken({
        sub: {
          session_id: createSession.id,
        },
      });

      return {
        message: 'You have logged in successfully',
        session: createSession.id,
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

  async logout(session_id: string) {
    try {
      await this.sessionRepo.update(session_id, {
        status: SessionStatus.LOGOUT,
      });

      return {
        message: 'User logout successfully',
      };
    } catch (error) {
      console.log('error: ', error);
      throw error;
    }
  }

  async refreshToken(refresh_token: string | null | undefined) {
    if (!refresh_token) {
      throw new UnauthorizedException('Session expired, Please login again!');
    }

    const refreshTokenDecoded =
      await this.tokenService.verifyRefreshToken(refresh_token);

    if (
      !refreshTokenDecoded ||
      !refreshTokenDecoded.sub ||
      !refreshTokenDecoded.sub.session_id
    ) {
      throw new UnauthorizedException('Session expired, Please login again!');
    }

    const verifySession = await this.verifySession(
      refreshTokenDecoded.sub.session_id,
    );

    if (!verifySession) {
      throw new UnauthorizedException('Session expired, Please login again!');
    }

    const new_access_token = await this.tokenService.signAccessToken({
      sub: {
        session_id: verifySession.session.id,
      },
    });

    const new_refresh_token = await this.tokenService.signRefreshToken({
      sub: {
        session_id: verifySession.session.id,
      },
    });

    return {
      message: 'You have logged in successfully',
      user: {
        first_name: verifySession.user.first_name,
        last_name: verifySession.user.last_name,
        email: verifySession.user.email,
        email_verified: verifySession.user.email_verified,
        picture: verifySession.user.picture,
        status: verifySession.user.status,
        friends: verifySession.user.friends,
        sentFriendRequests: verifySession.user.sentFriendRequests,
        receviedFriendRequests: verifySession.user.receviedFriendRequests,
        id: verifySession.user.id,
        createdAt: verifySession.user.createdAt,
        updatedAt: verifySession.user.updatedAt,
      },
      access_token: new_access_token,
      refresh_token: new_refresh_token,
    };
  }
}
