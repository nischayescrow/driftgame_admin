import { Test, TestingModule } from '@nestjs/testing';
import { GamemodeService } from './gamemode.service';

describe('GamemodeService', () => {
  let service: GamemodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamemodeService],
    }).compile();

    service = module.get<GamemodeService>(GamemodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
