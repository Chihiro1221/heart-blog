import { Module } from '@nestjs/common';
import { BlogrollsController } from './blogrolls.controller';

@Module({
  controllers: [BlogrollsController]
})
export class BlogrollsModule {}
