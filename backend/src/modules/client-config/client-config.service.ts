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
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';

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

      await this.clientConfigRepo.create(createClientConfigDto);

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

        if (dubConfig) {
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

      console.log('updated-Config: ', updated);

      console.log(
        updated &&
          updated.underMaintenance &&
          updated.underMaintenance.currentStatus,
        oldMaintainanceStatus,
      );

      if (updated && updated.underMaintenance) {
        if (updated.underMaintenance.currentStatus && !oldMaintainanceStatus) {
          const isAlreadyInMaintainance = await this.redis.sismember(
            `undermaintainance`,
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
