import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CarLockedStatus } from '../schemas/car.schema';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  top_speed: number;

  @IsNotEmpty()
  @IsNumber()
  engine: number;

  @IsNotEmpty()
  @IsNumber()
  breaking: number;

  @IsNotEmpty()
  @IsNumber()
  fuel: number;

  @IsNotEmpty()
  @IsEnum(CarLockedStatus)
  locked: number;

  @IsNotEmpty()
  @IsNumber()
  unlocked_at_level: number;

  @IsNotEmpty()
  @IsNumber()
  price_in_key: number;

  @IsNotEmpty()
  @IsNumber()
  price_in_coin: number;

  @IsNotEmpty()
  @IsNumber()
  offer_percentage: number;
}
