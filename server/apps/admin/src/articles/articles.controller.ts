import { ArticlesService } from './articles.service';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Article } from '@db/db/models/article.model';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';
import { createArticleDto } from '@common/common/dto/article.dto';
import { getUserDecorator } from '@common/common/decorator/getUser.decorator';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';

@ApiBearerAuth()
@ApiTags('文章管理')
@Crud({
  model: Article,
  routes: {
    find: false,
  },
})
@Controller('articles')
export class ArticlesController {
  constructor(@InjectModel(Article) private readonly model: Model<Article>, private readonly articleService: ArticlesService) {}

  @ApiOperation({ summary: '文章列表' })
  @Get()
  async index(@Query() query?) {
    return this.articleService.find(query);
  }

  @ApiOperation({ summary: '根据id获取' })
  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    await this.index();
    return this.articleService.findOneByAdmin(id);
  }

  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() dto: createArticleDto, @getUserDecorator() user) {
    return this.articleService.create(user, dto);
  }

  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Roles(RoleEnum.SuperAdmin)
  @Delete()
  async deleteMany(@Body() dto) {
    return this.articleService.deleteMany(dto);
  }

  @Roles(RoleEnum.SuperAdmin)
  @ApiOperation({ summary: '彻底删除' })
  @ApiBody({ isArray: true })
  @Roles(RoleEnum.Admin, RoleEnum.SuperAdmin)
  @Delete('deleteMany')
  async confirmedDeleteMany(@Body() dto) {
    return this.articleService.confirmedDeleteMany(dto);
  }
}
