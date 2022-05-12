import { Test, TestingModule } from '@nestjs/testing';
import { BlogrollsController } from './blogrolls.controller';

describe('BlogrollsController', () => {
  let controller: BlogrollsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogrollsController],
    }).compile();

    controller = module.get<BlogrollsController>(BlogrollsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
