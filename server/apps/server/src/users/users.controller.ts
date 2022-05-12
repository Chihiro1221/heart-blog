import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { User } from '@db/db/models/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@ApiTags('用户')
@Crud({
  model: User,
  routes: {
    delete: false,
    update: false,
    create: false,
    findOne: false,
  },
})
@Controller('users')
export class UsersController {
  constructor(@InjectModel(User) private readonly model: Model<User>, private readonly userService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('collection/:id')
  @ApiOperation({ summary: '收藏文章' })
  getCollection(@Param('id') id: string) {
    return this.userService.getCollection(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Put('collection/:id')
  @ApiOperation({ summary: '更新收藏信息' })
  updateCollection(@Param('id') id: string, @Body() body: any) {
    return this.userService.updateCollection(id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取用户信息' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
