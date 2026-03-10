import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayerlevelDto } from './create-playerlevel.dto';

export class UpdatePlayerlevelDto extends PartialType(CreatePlayerlevelDto) {}
