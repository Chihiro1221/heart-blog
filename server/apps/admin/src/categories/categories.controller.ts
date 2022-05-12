import { CategoriesService } from './categories.service';
import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Category } from '@db/db/models/category.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@ApiTags('分类')
@Controller('categories')
@ApiBearerAuth()
@Crud({
  model: Category,
})
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class CategoriesController {
  constructor(@InjectModel(Category) private readonly model: Model<Category>, private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: '获取列表' })
  async index(@Query() query) {
    return this.categoriesService.find(query);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新' })
  async update(@Param('id') id: string, @Body() dto) {
    return this.categoriesService.update(id, dto);
  }

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.categoriesService.deleteMany(dto);
  }
}
