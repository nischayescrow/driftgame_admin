import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlayerLevelStatus } from '../schemas/playerLevel.schema';

export class CreatePlayerlevelDto {
  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsNumber()
  xpToLevel: number;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsEnum(PlayerLevelStatus)
  status?: PlayerLevelStatus;
}
