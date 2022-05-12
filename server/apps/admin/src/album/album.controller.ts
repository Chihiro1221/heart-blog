import { Crud } from 'nestjs-mongoose-crud';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete } from '@nestjs/common';
import { Album } from '@db/db/models/album.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { RoleEnum } from '@common/common/enum/role.enum';
import { Roles } from '@common/common/decorator/role.decorator';

@ApiTags('相册')
@Crud({
  model: Album,
})
@ApiBearerAuth()
@Controller('album')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class AlbumController {
  constructor(@InjectModel(Album) private readonly model: Model<Album>) {}

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.deleteMany(dto);
  }
}
