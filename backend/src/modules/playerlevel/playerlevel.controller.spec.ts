import { Test, TestingModule } from '@nestjs/testing';
import { PlayerlevelController } from './playerlevel.controller';
import { PlayerlevelService } from './playerlevel.service';

describe('PlayerlevelController', () => {
  let controller: PlayerlevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerlevelController],
      providers: [PlayerlevelService],
    }).compile();

    controller = module.get<PlayerlevelController>(PlayerlevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
