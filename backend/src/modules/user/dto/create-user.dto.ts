import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserAccStatus, UserLiveStatus } from '../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsNumber()
  avatar_id?: number;

  @IsOptional()
  @IsEnum(UserLiveStatus)
  live_status?: UserLiveStatus;

  @IsOptional()
  @IsEnum(UserAccStatus)
  acc_status?: UserAccStatus;

  @IsOptional()
  @IsNumber()
  totalCoins?: number;

  @IsOptional()
  @IsNumber()
  totalXp?: number;
}
