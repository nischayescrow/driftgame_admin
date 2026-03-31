import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';
import { IsEnum, IsOptional } from 'class-validator';
import { UserAccStatus, UserLiveStatus } from '../schemas/user.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
