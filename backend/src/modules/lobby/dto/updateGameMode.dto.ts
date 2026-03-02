import { PartialType } from '@nestjs/mapped-types';
import { CreateGameModeDto } from './createGameMode.dto';

export class UpdateGameModeDto extends PartialType(CreateGameModeDto) {}
