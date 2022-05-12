import { Module } from '@nestjs/common';
import { BlogrollsController } from './blogrolls.controller';
import { BlogrollsService } from './blogrolls.service';

@Module({
  controllers: [BlogrollsController],
  providers: [BlogrollsService]
})
export class BlogrollsModule {}
