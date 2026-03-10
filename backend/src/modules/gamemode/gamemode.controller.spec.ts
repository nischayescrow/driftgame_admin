import { Test, TestingModule } from '@nestjs/testing';
import { GamemodeController } from './gamemode.controller';
import { GamemodeService } from './gamemode.service';

describe('GamemodeController', () => {
  let controller: GamemodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamemodeController],
      providers: [GamemodeService],
    }).compile();

    controller = module.get<GamemodeController>(GamemodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
