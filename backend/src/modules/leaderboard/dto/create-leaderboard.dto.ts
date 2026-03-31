import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LeaderboardScope } from '../schemas/leaderboard.schema';

export class CreateLeaderboardDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsEnum(LeaderboardScope)
  scope: number;

  @IsOptional()
  @IsString()
  game_mode?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDriftScore?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalXp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matchesPlayed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wins?: number;
}
