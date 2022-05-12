import { HttpException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Crud } from 'nestjs-mongoose-crud';
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from '@db/db/models/tag.model';

@ApiTags('标签')
@Crud({
  model: Tag,
  routes: {
    update: false,
    delete: false,
    create: false,
  },
})
@Controller('tags')
export class TagsController {
  constructor(@InjectModel(Tag) private readonly model: Model<Tag>) {}

  @Get(':id')
  @ApiOperation({ summary: '获取单个' })
  findOne(@Param('id') id: string) {
    return this.model.findById(id).catch((err) => {
      if (err.path === '_id') {
        throw new HttpException('该标签信息不存在', 404);
      }
    });
  }
}
