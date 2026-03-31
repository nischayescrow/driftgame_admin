import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CreateLeaderboardDto } from './create-leaderboard.dto';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {}
