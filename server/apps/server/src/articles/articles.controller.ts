import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { createArticleDto } from '@common/common/dto/article.dto';
import { ArticlesService } from 'apps/admin/src/articles/articles.service';
import { getUserDecorator } from '@common/common/decorator/getUser.decorator';

@ApiTags('文章')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticlesService) {}

  @ApiOperation({ summary: '文章列表' })
  @Get()
  async index(@Query() query?) {
    return this.articleService.find(query);
  }

  @ApiOperation({ summary: '根据id获取' })
  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    await this.index();
    return this.articleService.findOneByServer(id);
  }

  @ApiOperation({ summary: '创建文章' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: createArticleDto, @getUserDecorator() user) {
    return this.articleService.create(user, dto);
  }

  @ApiOperation({ summary: '批量彻底删除' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/confirm_delete_many')
  async confirmDeleteMany(@Body() ids: string[]) {
    return this.articleService.confirmDeleteMany(ids);
  }

  @ApiOperation({ summary: '回收文章' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async recycle(@Param('id') id: string) {
    return this.articleService.recycle(id);
  }

  @ApiOperation({ summary: '移出回收站' })
  @UseGuards(AuthGuard('jwt'))
  @Put('/move_recycle/:id')
  async moveRecycle(@Param('id') id: string) {
    return this.articleService.moveRecycle(id);
  }

  @ApiOperation({ summary: '彻底删除' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/confirm_delete/:id')
  async confirmDelete(@Param('id') id: string) {
    return this.articleService.confirmDelete(id);
  }

  @ApiOperation({ summary: '更新' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: createArticleDto) {
    return this.articleService.update(id, dto);
  }
}
