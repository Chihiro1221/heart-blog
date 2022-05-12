import { MenusService } from './menus.service';
import { Model } from 'mongoose';
import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Menu } from '@db/db/models/menu.model';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@Controller('menus')
@ApiTags('菜单管理')
@ApiBearerAuth()
@Crud({
  model: Menu,
})
@Roles(RoleEnum.SuperAdmin)
export class MenusController {
  constructor(@InjectModel(Menu) private readonly model: Model<Menu>, private readonly menuService: MenusService) {}

  @Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
  @ApiOperation({ summary: '获取列表' })
  @Get()
  async index(@Query() query) {
    return this.menuService.find(query);
  }

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.menuService.deleteMany(dto);
  }
}
