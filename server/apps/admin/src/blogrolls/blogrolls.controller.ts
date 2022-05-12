import { BlogrollsService } from './blogrolls.service';
import { Body, Controller, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Blogroll } from '@db/db/models/blogroll.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@ApiTags('友情链接')
@Crud({
  model: Blogroll,
})
@Controller('blogrolls')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class BlogrollsController {
  constructor(@InjectModel(Blogroll) private readonly model: Model<Blogroll>, private readonly blogrollsService: BlogrollsService) {}

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.blogrollsService.deleteMany(dto);
  }
}
