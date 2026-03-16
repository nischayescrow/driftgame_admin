import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarRepository } from './car.repository';
import { CarDocument, CarStatus } from './schemas/car.schema';

@Injectable()
export class CarService {
  constructor(private readonly carRepo: CarRepository) {}

  async findById(id: string, all: boolean = false) {
    try {
      const findCar = await this.carRepo.findById(id, all);

      // console.log('findById', findConfig);

      if (!findCar) {
        throw new NotFoundException('Car do not found!');
      }

      const data: Partial<CarDocument> & { id: string } = {
        id: findCar.id,
        name: findCar.name,
        top_speed: findCar.top_speed,
        engine: findCar.engine,
        breaking: findCar.breaking,
        fuel: findCar.fuel,
        locked: findCar.locked,
        unlocked_at_level: findCar.unlocked_at_level,
        price_in_key: findCar.price_in_key,
        price_in_coin: findCar.price_in_coin,
        offer_percentage: findCar.offer_percentage,
        status: findCar.status,
      };

      return {
        data,
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

      if (findCar && findCar.data && findCar.data.length > 0) {
        const data = findCar.data.map((c) => {
          return {
            id: c.id,
            name: c.name,
            top_speed: c.top_speed,
            engine: c.engine,
            breaking: c.breaking,
            fuel: c.fuel,
            locked: c.locked,
            unlocked_at_level: c.unlocked_at_level,
            price_in_key: c.price_in_key,
            price_in_coin: c.price_in_coin,
            offer_percentage: c.offer_percentage,
            status: c.status,
          };
        });

        return {
          data,
          total: findCar.total,
          page,
          limit,
        };
      } else {
        return {
          data: [],
          total: 0,
          page,
          limit,
        };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(limit: number = 10, page: number = 0) {
    try {
      const findCar = await this.carRepo.findAll(limit, page);

      if (findCar && findCar.data && findCar.data.length > 0) {
        const data = findCar.data.map((c) => {
          return {
            id: c.id,
            name: c.name,
            top_speed: c.top_speed,
            engine: c.engine,
            breaking: c.breaking,
            fuel: c.fuel,
            locked: c.locked,
            unlocked_at_level: c.unlocked_at_level,
            price_in_key: c.price_in_key,
            price_in_coin: c.price_in_coin,
            offer_percentage: c.offer_percentage,
            status: c.status,
          };
        });

        return {
          data,
          total: findCar.total,
          page,
          limit,
        };
      } else {
        return {
          data: [],
          total: 0,
          page,
          limit,
        };
      }
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
