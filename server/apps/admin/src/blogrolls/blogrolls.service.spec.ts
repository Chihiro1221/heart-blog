import { Test, TestingModule } from '@nestjs/testing';
import { BlogrollsService } from './blogrolls.service';

describe('BlogrollsService', () => {
  let service: BlogrollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogrollsService],
    }).compile();

    service = module.get<BlogrollsService>(BlogrollsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
