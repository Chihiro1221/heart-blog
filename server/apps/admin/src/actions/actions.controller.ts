import { ActionsService } from './actions.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Action } from '@db/db/models/action.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { createActionDto } from '@common/common/dto/create-action.dto';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@ApiTags('操作')
@ApiBearerAuth()
@Crud({
  model: Action,
  routes: {
    create: false,
  },
})
@Controller('actions')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class ActionsController {
  constructor(@InjectModel(Action) private readonly model: Model<Action>, private readonly actionsService: ActionsService) {}

  @Post()
  async create(@Body() dto: createActionDto) {
    return this.actionsService.create(dto);
  }
}
