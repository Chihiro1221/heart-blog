import { EmailCode } from './models/email-code';
import { Article } from './models/article.model';
import { User } from '@db/db/models/user.model';
import { Album } from './models/album.model';
import { Role } from './models/role.model';
import { Menu } from './models/menu.model';
import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { CommonModule } from '@common/common';
import { Category } from '@db/db/models/category.model';
import { Tag } from '@db/db/models/tag.model';
import { Action } from '@db/db/models/action.model';
import { Comment } from '@db/db/models/comment.model';
import { Blogroll } from '@db/db/models/blogroll.model';

const models = TypegooseModule.forFeature([User, Article, Menu, Role, Category, Tag, Album, Action, Comment, Blogroll, EmailCode]);

@Global()
@Module({
  imports: [
    CommonModule,
    TypegooseModule.forRootAsync({
      useFactory(configService) {
        return {
          uri: configService.get('env').DB_URI ?? 'mongodb://localhost:27017/blog',
        };
      },
      inject: [ConfigService],
    }),
    models,
  ],
  providers: [DbService],
  exports: [DbService, models],
})
export class DbModule {}
