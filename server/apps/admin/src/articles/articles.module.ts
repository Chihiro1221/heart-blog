import {Module} from '@nestjs/common';
import {ArticlesController} from './articles.controller';
import {ArticlesService} from './articles.service';
import {DbModule} from "@db/db";

@Module({
  imports: [DbModule],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {
}
