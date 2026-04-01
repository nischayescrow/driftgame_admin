import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isObjectIdOrHexString, Model } from 'mongoose';
import { UpdateClientConfigDto } from './dto/update-config.dto';
import { CreateClientConfigDto } from './dto/create-config.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ClientConfig } from './schemas/client-config.schema';
import { ClientConfigRepository } from './repositories/client-config.repository';
import { ClientConfigProj } from './types/client-config.type';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.constant';

@Injectable()
export class ClientConfigService {
  constructor(
    private readonly clientConfigRepo: ClientConfigRepository,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {
    console.log('Client configed initialized!!');
  }

  async findById(id: string) {
    try {
      const findConfig = await this.clientConfigRepo.findById(id);

      // console.log('findById', findConfig);

      if (!findConfig) {
        throw new NotFoundException('Config do not found!');
      }

      return {
        data: {
          id: findConfig.id,
          clientBuildVersion: findConfig.clientBuildVersion,
          updateRequired: findConfig.updateRequired,
          underMaintenance: findConfig.underMaintenance,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByVersion(version: string) {
    try {
      const findConfig = await this.clientConfigRepo.findByBuildVer(
        parseInt(version),
      );

      // console.log('findById', findConfig);

      if (!findConfig) {
        throw new NotFoundException('Client config do not found!');
      }

      return {
        data: {
          id: findConfig.id,
          clientBuildVersion: findConfig.clientBuildVersion,
          updateRequired: findConfig.updateRequired,
          underMaintenance: findConfig.underMaintenance,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(limit: number = 10, page: number = 0) {
    try {
      const findConfigs = await this.clientConfigRepo.findAll(limit, page);

      // console.log(findConfigs);

      if (!findConfigs.data || findConfigs.data.length <= 0) {
        return { data: [], total: 0, page, limit };
      }

      const data = findConfigs.data.map((config) => {
        return {
          id: config.id,
          clientBuildVersion: config.clientBuildVersion,
          updateRequired: config.updateRequired,
          underMaintenance: config.underMaintenance,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        };
      });

      return {
        data,
        total: findConfigs.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async search(text: string, limit: number = 10, page: number = 0) {
    try {
      const findConfigs = await this.clientConfigRepo.search(text, limit, page);

      // console.log('findConfigs: ', findConfigs);

      if (!findConfigs.data || findConfigs.data.length <= 0) {
        return { data: [], total: 0, page, limit };
      }

      const data = findConfigs.data.map((config) => {
        return {
          id: String(config._id),
          clientBuildVersion: config.clientBuildVersion,
          updateRequired: config.updateRequired,
          underMaintenance: config.underMaintenance,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        };
      });

      return {
        data,
        total: findConfigs.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createClientConfigDto: CreateClientConfigDto) {
    try {
      const findConfig = await this.clientConfigRepo.findByBuildVer(
        createClientConfigDto.clientBuildVersion,
      );

      // console.log('findConfig: ', findConfig);

      if (findConfig) {
        throw new BadRequestException(
          'Config with that build version already exist!',
        );
      }

      const created = await this.clientConfigRepo.create(createClientConfigDto);

      if (created && created.underMaintenance.currentStatus) {
        await this.redis.sadd(
          `undermaintainance:list`,
          String(created.clientBuildVersion),
        );

        const maintainancePayload = {
          clientBuildVersion: created.clientBuildVersion,
          isUnderMaintainance: true,
          appliedAt: Date.now(),
          isBroadcatedOnce: false,
        };

        await this.redis.hset(
          `undermaintainance:version:${created.clientBuildVersion}`,
          maintainancePayload,
        );

        console.log('UnderMaintainance triggered!!');

        this.redis.publish(
          'under-maintenance:changed',
          JSON.stringify(maintainancePayload),
        );
      }

      return {
        message: 'Config created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updateClientConfigDto: UpdateClientConfigDto) {
    try {
      const findConfig = await this.findById(id);

      const oldMaintainanceStatus =
        findConfig.data.underMaintenance.currentStatus;

      console.log('findConfig: ', findConfig);

      if (updateClientConfigDto.clientBuildVersion) {
        const dubConfig = await this.clientConfigRepo.findByBuildVer(
          updateClientConfigDto.clientBuildVersion,
        );

        if (dubConfig && dubConfig.id !== findConfig.data.id) {
          throw new BadRequestException(
            'Client config with same model already exist!',
          );
        }
      }

      if (updateClientConfigDto.underMaintenance) {
        updateClientConfigDto.underMaintenance = Object.assign(
          findConfig.data.underMaintenance,
          updateClientConfigDto.underMaintenance,
        );
      }

      const updated = await this.clientConfigRepo.update(
        id,
        updateClientConfigDto,
      );

      // console.log('updated-Config: ', updated);

      // console.log(
      //   updated &&
      //     updated.underMaintenance &&
      //     updated.underMaintenance.currentStatus,
      //   oldMaintainanceStatus,
      // );

      if (updated && updated.underMaintenance) {
        if (updated.underMaintenance.currentStatus && !oldMaintainanceStatus) {
          const isAlreadyInMaintainance = await this.redis.sismember(
            `undermaintainance:list`,
            String(updated.clientBuildVersion),
          );

          console.log('isAlreadyInMaintainance: ', isAlreadyInMaintainance);

          if (isAlreadyInMaintainance === 0) {
            await this.redis.sadd(
              `undermaintainance:list`,
              String(updated.clientBuildVersion),
            );

            const maintainancePayload = {
              clientBuildVersion: updated.clientBuildVersion,
              isUnderMaintainance: true,
              appliedAt: Date.now(),
              isBroadcatedOnce: false,
            };

            await this.redis.hset(
              `undermaintainance:version:${updated.clientBuildVersion}`,
              maintainancePayload,
            );

            console.log('UnderMaintainance triggered!!');

            this.redis.publish(
              'under-maintenance:changed',
              JSON.stringify(maintainancePayload),
            );
          } else {
            console.log('Already under maintainance!');
          }
        }

        if (!updated.underMaintenance.currentStatus) {
          await this.redis.srem(
            `undermaintainance:list`,
            String(updated.clientBuildVersion),
          );

          await this.redis.del(
            `undermaintainance:version:${updated.clientBuildVersion}`,
          );

          const maintainancePayload = {
            clientBuildVersion: updated.clientBuildVersion,
            isUnderMaintainance: false,
            removedAt: Date.now(),
            isBroadcatedOnce: false,
          };

          console.log('UnderMaintainance removal triggered!!');

          this.redis.publish(
            'under-maintenance:changed',
            JSON.stringify(maintainancePayload),
          );
        }
      }

      return {
        message: 'Config updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      const findConfig = await this.findById(id);

      if (findConfig && findConfig.data.underMaintenance.currentStatus) {
        await this.redis.srem(
          `undermaintainance:list`,
          String(findConfig.data.clientBuildVersion),
        );

        await this.redis.del(
          `undermaintainance:version:${findConfig.data.clientBuildVersion}`,
        );

        const maintainancePayload = {
          clientBuildVersion: findConfig.data.clientBuildVersion,
          isUnderMaintainance: false,
          removedAt: Date.now(),
          isBroadcatedOnce: false,
        };

        console.log('UnderMaintainance removal triggered!!');

        this.redis.publish(
          'under-maintenance:changed',
          JSON.stringify(maintainancePayload),
        );
      }

      await this.clientConfigRepo.delete(id);

      return {
        message: 'Config deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
