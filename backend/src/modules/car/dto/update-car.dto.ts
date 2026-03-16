import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { CarStatus } from '../schemas/car.schema';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsOptional()
  @IsEnum(CarStatus)
  status?: number;
}
