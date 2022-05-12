import { RolesService } from './roles.service';
import { Model } from 'mongoose';
import { Role } from '@db/db/models/role.model';
import { Controller, Delete, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { Crud } from 'nestjs-mongoose-crud';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@Controller('roles')
@ApiTags('角色管理')
@Crud({
  model: Role,
})
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class RolesController {
  constructor(@InjectModel(Role) private readonly model: Model<Role>, private readonly roleService: RolesService) {}

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Delete()
  async deleteMany(@Body() dto) {
    return this.roleService.deleteMany(dto);
  }
}
