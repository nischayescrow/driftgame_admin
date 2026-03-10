import { Test, TestingModule } from '@nestjs/testing';
import { PlayerlevelService } from './playerlevel.service';

describe('PlayerlevelService', () => {
  let service: PlayerlevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerlevelService],
    }).compile();

    service = module.get<PlayerlevelService>(PlayerlevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
