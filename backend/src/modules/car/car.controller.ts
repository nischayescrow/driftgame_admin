import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('admin/car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  // <============== GameMode ==============>
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createCar(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  @Get('findall')
  @HttpCode(HttpStatus.OK)
  findAllCar(@Query('limit') limit: number, @Query('page') page: number) {
    return this.carService.findAll(limit, page);
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  findOneCar(@Param('id') id: string, @Query('all') all: boolean) {
    return this.carService.findById(id, all);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  searchCar(
    @Query('text') text: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    if (!text || text.length < 1) {
      return this.carService.findAll(limit, page);
    }

    return this.carService.search(text, limit, page);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  updateCar(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carService.updateById(id, updateCarDto);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  removeCar(@Param('id') id: string) {
    return this.carService.deleteById(id);
  }
}
