import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientConfigService } from './client-config.service';
import { CreateClientConfigDto } from './dto/create-config.dto';
import { UpdateClientConfigDto } from './dto/update-config.dto';
import { isObjectIdOrHexString } from 'mongoose';

@Controller('admin/client-config')
export class ClientConfigController {
  constructor(private readonly clientConfigService: ClientConfigService) {}

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string) {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    return this.clientConfigService.findById(id.trim());
  }

  @Get('get/all')
  @HttpCode(HttpStatus.OK)
  findAllConfig(@Query('limit') limit: number, @Query('page') page: number) {
    return this.clientConfigService.findAll(limit, page);
  }

  @Get('get/version/:version')
  @HttpCode(HttpStatus.OK)
  findByBuildVersion(@Param('version') version: string) {
    if (version.trim().length <= 0) {
      throw new BadGatewayException('Version is required!');
    }

    return this.clientConfigService.findByVersion(version.trim());
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientConfigDto: CreateClientConfigDto) {
    return this.clientConfigService.create(createClientConfigDto);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateById(
    @Param('id') id: string,
    @Body() updateClientConfigDto: UpdateClientConfigDto,
  ) {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    return this.clientConfigService.updateById(
      id.trim(),
      updateClientConfigDto,
    );
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  deleteById(@Param('id') id: string) {
    const isObjectId = isObjectIdOrHexString(id);

    if (!isObjectId) {
      throw new BadRequestException('Invalid config id!');
    }

    return this.clientConfigService.deleteById(id.trim());
  }
}
