import { Model } from 'mongoose';
import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectModel } from 'nestjs-typegoose';
import { Crud } from 'nestjs-mongoose-crud';
import { User } from '@db/db/models/user.model';
import userDto from '@common/common/dto/user.dto';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';
import { UsersService } from './users.service';

@ApiTags('用户管理')
@ApiBearerAuth()
@Crud({
  model: User,
  routes: {
    update: false,
  },
})
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly model: Model<User>, private readonly userService: UsersService) {}

  @ApiOperation({ summary: '批量删除' })
  @ApiBody({ isArray: true })
  @Roles(RoleEnum.SuperAdmin)
  @Delete()
  async deleteMany(@Body() dto) {
    return this.userService.deleteMany(dto);
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiBody({ type: User })
  @Roles(RoleEnum.SuperAdmin)
  @Put(':id')
  async update(@Body() dto: userDto, @Param('id') id) {
    return this.userService.update(dto, id);
  }
}
