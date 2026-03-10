import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GameModeStatus } from '../schemas/gameMode.schema';

export class CreateGameModeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  map: string;

  @IsNotEmpty()
  @IsNumber()
  players: number;

  @IsOptional()
  @IsEnum(GameModeStatus)
  status?: GameModeStatus;
}
