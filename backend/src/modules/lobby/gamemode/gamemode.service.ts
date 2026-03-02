import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateGameModeDto } from '../dto/updateGameMode.dto';
import { CreateGameModeDto } from '../dto/createGameMode.dto';
import { GameModeProj } from '../types/lobby.type';
import { GameModeRepository } from '../repositories/gamemode.repository';
import { GameModeDocument, GameModeStatus } from '../schemas/gameMode.schema';

@Injectable()
export class GamemodeService {
  constructor(private readonly gameModeRepo: GameModeRepository) {}

  private gameModeProj: GameModeProj = {
    _id: 1,
    name: 1,
    identity: 1,
    purpose: 1,
    map: 1,
    players: 1,
    status: 1,
    createdAt: 1,
    updatedAt: 1,
  };

  async findById(id: string, all: boolean = false) {
    try {
      const findGameMode = await this.gameModeRepo.findById(
        id,
        all,
        this.gameModeProj,
      );

      // console.log('findById', findConfig);

      if (!findGameMode) {
        throw new NotFoundException('Game mode do not found!');
      }

      return findGameMode;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async search(
    text: string,
    limit: number = 10,
    page: number = 1,
    all: boolean = false,
  ) {
    try {
      const findModes = await this.gameModeRepo.search(
        text,
        limit,
        page,
        all,
        this.gameModeProj,
      );

      console.log(findModes);

      return {
        data: findModes.modes,
        total: findModes.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(limit: number = 10, page: number = 1, all: boolean = false) {
    try {
      const findGameModes = await this.gameModeRepo.findAll(
        limit,
        page,
        all,
        this.gameModeProj,
      );

      // console.log('findById', findConfig);

      if (!findGameModes) {
        throw new NotFoundException('Game mode do not found!');
      }

      return findGameModes;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createGameModeDto: CreateGameModeDto) {
    try {
      const findGameMode = await this.gameModeRepo.findByName(
        createGameModeDto.name,
        true,
        this.gameModeProj,
      );

      console.log('findGameMode: ', findGameMode);

      if (findGameMode) {
        throw new BadRequestException('Game mode with name already exist!');
      }

      await this.gameModeRepo.create(createGameModeDto);

      return {
        message: 'Game mode created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updateGameModeDto: UpdateGameModeDto) {
    try {
      await this.findById(id, true);

      if (updateGameModeDto.name) {
        const findGameMode = await this.gameModeRepo.findByName(
          updateGameModeDto.name,
          true,
          this.gameModeProj,
        );

        if (findGameMode) {
          throw new BadRequestException('Game mode name already exist!');
        }
      }

      await this.gameModeRepo.update(id, updateGameModeDto);

      return {
        message: 'Game mode updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      //   console.log('deleteById: ', id);

      await this.updateById(id, { status: GameModeStatus.DELETED });

      return {
        message: 'Game mode deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
