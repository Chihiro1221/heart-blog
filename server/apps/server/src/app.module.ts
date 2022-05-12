import { DbModule } from '@db/db';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { AlbumModule } from './album/album.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { CommonModule } from '@common/common';
import { ActionsModule } from './actions/actions.module';
import { UsersModule } from './users/users.module';
import { AdminService } from '../../admin/src/admin.service';
import { BlogrollsModule } from './blogrolls/blogrolls.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../web'),
      serveRoot: '/', // 开启服务之后的访问地址
      renderPath: '/',
    }),
    CommonModule,
    ArticlesModule,
    DbModule,
    CategoriesModule,
    AlbumModule,
    TagsModule,
    CommentsModule,
    CommonModule,
    ActionsModule,
    UsersModule,
    BlogrollsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminService],
})
export class AppModule {}
