import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerlevelDto } from './dto/create-playerlevel.dto';
import { UpdatePlayerlevelDto } from './dto/update-playerlevel.dto';
import { PlayerLevelRepository } from './playerlevel.repository';
import { PlayerLevelStatus } from './schemas/playerLevel.schema';

@Injectable()
export class PlayerlevelService {
  constructor(private readonly playerLevelRepo: PlayerLevelRepository) {}

  async findById(id: string) {
    try {
      const findPlayerLevel = await this.playerLevelRepo.findById(id);

      // console.log('findById', findConfig);

      if (!findPlayerLevel) {
        throw new NotFoundException('Game mode do not found!');
      }

      return {
        data: findPlayerLevel,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async search(text: string, limit: number = 10, page: number = 0) {
    try {
      const findPlayerLevel = await this.playerLevelRepo.search(
        text,
        limit,
        page,
      );

      // console.log(findPlayerLevel);

      return {
        data: findPlayerLevel.data ?? [],
        total: findPlayerLevel.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(limit: number = 10, page: number = 0) {
    try {
      const findPlayerLevel = await this.playerLevelRepo.findAll(limit, page);

      // console.log('findById', findConfig);

      return {
        data: findPlayerLevel.data ?? [],
        total: findPlayerLevel.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createPlayerlevelDto: CreatePlayerlevelDto) {
    try {
      const findPlayerLevel = await this.playerLevelRepo.findByLevelNo(
        createPlayerlevelDto.level,
      );

      // console.log('findPlayerLevel: ', findPlayerLevel);

      if (findPlayerLevel) {
        throw new BadRequestException('Player level already exist!');
      }

      createPlayerlevelDto.status = PlayerLevelStatus.ACTIVE;

      await this.playerLevelRepo.create(createPlayerlevelDto);

      return {
        message: 'Player level created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updatePlayerlevelDto: UpdatePlayerlevelDto) {
    try {
      await this.findById(id);

      if (updatePlayerlevelDto.level) {
        const findLevel = await this.playerLevelRepo.findByLevelNo(
          updatePlayerlevelDto.level,
        );

        if (findLevel && findLevel.id !== id) {
          throw new BadRequestException('Player level already exist!');
        }
      }

      await this.playerLevelRepo.update(id, updatePlayerlevelDto);

      return {
        message: 'Player level updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      //   console.log('deleteById: ', id);

      await this.updateById(id, { status: PlayerLevelStatus.DELETED });

      return {
        message: 'Player level deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
