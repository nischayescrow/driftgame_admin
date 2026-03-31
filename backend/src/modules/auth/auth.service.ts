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
import { UserAccStatus } from '../user/schemas/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailLoginDto } from './dto/emailLogin.dto';
import * as bcrypt from 'bcrypt';
import { REDIS_CLIENT } from '../redis/redis.constant';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { findByIdResType } from '../user/types/user.type';

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

      // console.log('verifySession-findSession: ', findSession);

      if (
        !findSession ||
        findSession.session_id !== session_id ||
        Number(findSession.status) !== SessionStatus.ACTIVE
      ) {
        return null;
      }

      const findUser = await this.userService.findById(
        findSession.user_id,
        false,
      );

      console.log('verifySession-findUser: ', findUser);

      if (!findUser || !findUser.data) {
        return null;
      }

      return {
        session: findSession,
        user: findUser.data,
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
      let findUser = await this.userService.findByEmail(
        emailLoginDto.email,
        false,
        true,
      );

      if (!findUser || !findUser.data) {
        throw new UnauthorizedException('Incorrect credentials!');
      }

      console.log('findUser.data: ', findUser.data);

      if (findUser.data.acc_status !== UserAccStatus.ACTIVE) {
        throw new BadRequestException('User account is not active');
      }

      if (!findUser.data.password) {
        throw new BadRequestException(
          'You have not set any password, try login with Google!',
        );
      }

      // check password here
      const isMatch = await bcrypt.compare(
        emailLoginDto.password,
        findUser.data.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Incorrect credentials!');
      }

      const createdSession = randomUUID();

      const access_token = await this.tokenService.signAccessToken({
        session_id: createdSession,
        user_id: findUser.data.id,
      });

      const refresh_token = await this.tokenService.signRefreshToken({
        session_id: createdSession,
        user_id: findUser.data.id,
      });

      const refresh_token_expires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      );

      const refresh_token_hashed = await bcrypt.hash(refresh_token, 10);
      // console.log('refresh_token_hashed: ', refresh_token_hashed);

      //Store session data in redis
      await this.redis.hset(`sessions:${findUser.data.id}`, {
        session_id: createdSession,
        user_id: findUser.data.id,
        hashedToken: refresh_token_hashed,
        status: SessionStatus.ACTIVE,
        createdAt: Date.now(),
        expiresAt: refresh_token_expires,
      });

      await this.redis.pexpire(
        `sessions:${findUser.data.id}`,
        7 * 24 * 60 * 60 * 1000,
      );

      const data: findByIdResType = {
        id: findUser.data.id,
        first_name: findUser.data.first_name,
        last_name: findUser.data.last_name,
        email: findUser.data.email,
        email_verified: findUser.data.email_verified,
        picture: findUser.data.picture,
        avatar_id: findUser.data.avatar_id,
        totalCoins: findUser.data.totalCoins,
        totalXp: findUser.data.totalXp,
        live_status: findUser.data.live_status,
      };

      //Update & Store user data in redis for 4 hr
      await this.redis.set(
        `userData:${data.id}`,
        JSON.stringify(data),
        'EX',
        4 * 60 * 60,
      );

      return {
        message: 'You have logged in successfully',
        data,
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

  async refreshToken(refresh_token: string): Promise<LoginUserRes> {
    try {
      const tokenDecoded =
        await this.tokenService.verifyRefreshToken(refresh_token);

      if (!tokenDecoded || !tokenDecoded.session_id || !tokenDecoded.user_id) {
        throw new UnauthorizedException();
      }

      // console.log('refresh_tokenDecoded: ', tokenDecoded);

      const userData = await this.verifySession(
        tokenDecoded.session_id,
        tokenDecoded.user_id,
      );

      // console.log('userData: ', userData);

      if (!userData) {
        throw new UnauthorizedException(
          'No active session, please login again!',
        );
      }

      const isMatch = await bcrypt.compare(
        refresh_token,
        userData.session.hashedToken,
      );

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const new_access_token = await this.tokenService.signAccessToken({
        session_id: userData.session.session_id,
        user_id: userData.user.id,
      });

      const new_refresh_token = await this.tokenService.signRefreshToken({
        session_id: userData.session.session_id,
        user_id: userData.user.id,
      });

      const refresh_token_hashed = await bcrypt.hash(new_refresh_token, 10);

      const refresh_token_expires = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      );

      await this.redis.hset(`sessions:${userData.user.id}`, {
        session_id: userData.session.session_id,
        user_id: userData.user.id,
        hashedToken: refresh_token_hashed,
        status: SessionStatus.ACTIVE,
        createdAt: Date.now(),
        expiresAt: refresh_token_expires,
      });

      await this.redis.pexpire(
        `sessions:${userData.user.id}`,
        7 * 24 * 60 * 60 * 1000,
      );

      const data: findByIdResType = {
        id: userData.user.id,
        first_name: userData.user.first_name,
        last_name: userData.user.last_name,
        email: userData.user.email,
        email_verified: userData.user.email_verified,
        picture: userData.user.picture,
        avatar_id: userData.user.avatar_id,
        totalCoins: userData.user.totalCoins,
        totalXp: userData.user.totalXp,
        live_status: userData.user.live_status,
      };

      //Update & Store user data in redis for 4 hr
      await this.redis.set(
        `userData:${data.id}`,
        JSON.stringify(data),
        'EX',
        4 * 60 * 60,
      );

      return {
        message: 'You have logged in successfully',
        data,
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
