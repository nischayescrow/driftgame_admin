import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './car.repository';
import { CarStatus } from './schemas/car.schema';

@Injectable()
export class CarService {
  constructor(private readonly carRepo: CarRepository) {}

  async findById(id: string, all: boolean = false) {
    try {
      const findCar = await this.carRepo.findById(id, all);

      // console.log('findById', findConfig);

      if (!findCar) {
        throw new NotFoundException('Game mode do not found!');
      }

      return {
        data: findCar,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async search(text: string, limit: number = 10, page: number = 0) {
    try {
      const findCar = await this.carRepo.search(text, limit, page);

      // console.log(findCar);

      return {
        data: findCar.data ?? [],
        total: findCar.total,
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
      const findCar = await this.carRepo.findAll(limit, page);

      // console.log('findById', findConfig);

      return {
        data: findCar.data ?? [],
        total: findCar.total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(createCarDto: CreateCarDto) {
    try {
      const findCar = await this.carRepo.findByName(createCarDto.name, true);

      if (findCar) {
        throw new BadRequestException('Player level already exist!');
      }

      await this.carRepo.create(createCarDto);

      return {
        message: 'Car created successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateById(id: string, updateCarDto: UpdateCarDto) {
    try {
      await this.findById(id, true);

      if (updateCarDto.name) {
        const findCar = await this.carRepo.findByName(updateCarDto.name, true);

        if (findCar && findCar.id !== id) {
          throw new BadRequestException('Car already exist!');
        }
      }

      await this.carRepo.update(id, updateCarDto);

      return {
        message: 'Car updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      await this.findById(id, true);

      await this.carRepo.update(id, { status: CarStatus.DELETED });

      return {
        message: 'Car deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
