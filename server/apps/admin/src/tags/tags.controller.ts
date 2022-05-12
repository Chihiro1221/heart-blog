import { TagsService } from './tags.service';
import { Body, Controller, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from '@db/db/models/tag.model';
import { Model } from 'mongoose';
import { Crud } from 'nestjs-mongoose-crud';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@ApiTags('标签管理')
@Crud({
  model: Tag,
})
@Controller('tags')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class TagsController {
  constructor(@InjectModel(Tag) private readonly model: Model<Tag>, private readonly tagService: TagsService) {}

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.tagService.deleteMany(dto);
  }
}
