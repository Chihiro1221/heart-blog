import { CommonModule } from '@common/common';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { MenusModule } from './menus/menus.module';
import { RolesModule } from './roles/roles.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@common/common/guard/roles.guard';
import { JwtAuthGuard } from '@common/common/guard/jwt.guard';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { AlbumModule } from './album/album.module';
import { ActionsModule } from './actions/actions.module';
import { CommentsModule } from './comments/comments.module';
import { BlogrollsModule } from './blogrolls/blogrolls.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../client'),
      serveRoot: '/', // 开启服务之后的访问地址
      renderPath: '/',
    }),
    ArticlesModule,
    UsersModule,
    MenusModule,
    CommonModule,
    RolesModule,
    CategoriesModule,
    TagsModule,
    AlbumModule,
    ActionsModule,
    CommentsModule,
    BlogrollsModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    // 全局注入验证token
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局注入角色守卫
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AdminModule {}
