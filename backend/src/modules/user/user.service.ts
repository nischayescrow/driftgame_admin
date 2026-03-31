import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAccStatus } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { findByIdResType } from './types/user.type';
import { UserRepository } from './repositories/user.repository';
import Redis from 'ioredis';
import { isObjectIdOrHexString } from 'mongoose';
import { REDIS_CLIENT } from '../redis/redis.constant';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { GamemodeService } from '../gamemode/gamemode.service';
import { LeaderboardScope } from '../leaderboard/schemas/leaderboard.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    // @Inject(forwardRef(() => GameSettingService))
    // private readonly gameSettingService: GameSettingService,
    @Inject(forwardRef(() => LeaderboardService))
    private readonly leaderBoardService: LeaderboardService,
    private readonly gameModeService: GamemodeService,
  ) {}

  async findById(
    id: string,
    all: boolean = false,
  ): Promise<{ data: findByIdResType | null }> {
    try {
      const isObjectId = isObjectIdOrHexString(id);

      if (!isObjectId) {
        throw new BadRequestException('Invalid user id!');
      }

      //Get data from redis if exist
      const getDataFromRedis = await this.redis.get(`userData:${id}`);

      if (getDataFromRedis) {
        console.log('From redis');
        const data: findByIdResType = JSON.parse(getDataFromRedis);

        return { data };
      }

      const findUser = await this.userRepo.findById(id, all);

      console.log('findUser-findById', findUser);

      if (!findUser) {
        return { data: null };
      }

      let data: findByIdResType = {
        id: findUser.id,
        first_name: findUser.first_name,
        last_name: findUser.last_name,
        email: findUser.email,
        email_verified: findUser.email_verified,
        picture: findUser.picture,
        avatar_id: findUser.avatar_id,
        totalCoins: findUser.totalCoins,
        totalXp: findUser.totalXp,
        acc_status: findUser.acc_status,
        live_status: findUser.live_status,
      };

      //Store data in redis for 4 hr
      await this.redis.set(
        `userData:${findUser.id}`,
        JSON.stringify(data),
        'EX',
        4 * 60 * 60,
      );

      return { data };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByEmail(
    email: string,
    all: boolean = false,
    pass: boolean = false,
  ) {
    try {
      const findUser = await this.userRepo.findByEmail(email, all);

      if (!findUser) {
        return { data: null };
      }

      // console.log('findUser', findUser);

      let data: findByIdResType = {
        id: findUser.id,
        first_name: findUser.first_name,
        last_name: findUser.last_name,
        email: findUser.email,
        email_verified: findUser.email_verified,
        picture: findUser.picture,
        avatar_id: findUser.avatar_id,
        totalCoins: findUser.totalCoins,
        totalXp: findUser.totalXp,
        acc_status: findUser.acc_status,
        live_status: findUser.live_status,
      };

      //Store user data in redis for 4 hr
      await this.redis.set(
        `userData:${findUser.id}`,
        JSON.stringify(data),
        'EX',
        4 * 60 * 60,
      );

      if (pass) data.password = findUser.password;

      return { data };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 0,
    all: boolean = false,
  ) {
    try {
      const findUsers = await this.userRepo.search(text, limit, page, all);

      // console.log(findUsers);

      if (!findUsers.users || findUsers.users.length <= 0) {
        return { data: [], total: 0, page, limit };
      }

      const data = findUsers.users.map((usr) => {
        return {
          id: usr.id,
          first_name: usr.first_name,
          last_name: usr.last_name,
          email: usr.email,
          email_verified: usr.email_verified,
          picture: usr.picture,
          acc_status: usr.acc_status,
          live_status: usr.live_status,
        };
      });

      return {
        data,
        total: findUsers.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const findUser = await this.findByEmail(createUserDto.email, true);

      if (findUser.data) {
        throw new BadRequestException('User already registered!');
      }

      if (createUserDto.password) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      }

      createUserDto.acc_status = UserAccStatus.ACTIVE;

      const created = await this.userRepo.create(createUserDto);

      console.log('Created-USer: ', created);

      // create user default Game settings
      // await this.gameSettingService.create(createdUser.id, DefaultGameSetting);

      // create user default leaderboards
      await this.leaderBoardService.create({
        user_id: created.id,
        scope: LeaderboardScope.GLOBAL,
      });

      const getAllGameModes = await this.gameModeService.findAll(10, 1, true);

      if (
        getAllGameModes &&
        getAllGameModes.data &&
        getAllGameModes.data.length > 0
      ) {
        await Promise.all(
          getAllGameModes.data.map(async (mode) => {
            await this.leaderBoardService.create({
              user_id: created.id,
              scope: LeaderboardScope.MODE,
              game_mode: mode.id,
            });
          }),
        );
      }

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findById(id, true);

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // console.log('updateUserDto: ', updateUserDto);

      const updated = await this.userRepo.update(id, updateUserDto);

      if (!updated) {
        throw new InternalServerErrorException(
          'Error occured while updating user!',
        );
      }

      const data: findByIdResType = {
        id: updated.id,
        first_name: updated.first_name,
        last_name: updated.last_name,
        email: updated.email,
        email_verified: updated.email_verified,
        picture: updated.picture,
        avatar_id: updated.avatar_id,
        totalCoins: updated.totalCoins,
        totalXp: updated.totalXp,
        live_status: updated.live_status,
      };

      //Update & Store user data in redis for 4 hr
      await this.redis.set(
        `userData:${updated.id}`,
        JSON.stringify(data),
        'EX',
        4 * 60 * 60,
      );

      return {
        message: 'User updated successfully',
        data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      // console.log('UpdateId: ', id);
      const findUser = await this.findById(id, true);

      if (!findUser || !findUser.data) {
        throw new NotFoundException('User do not found!');
      }

      //remove data from redis
      await this.redis.del(`userData:${findUser.data.id}`);

      await this.updateById(findUser.data.id, {
        acc_status: UserAccStatus.DELETED,
      });

      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
