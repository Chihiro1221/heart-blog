import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Crud } from "nestjs-mongoose-crud"
import { Action } from "@db/db/models/action.model"
import { InjectModel } from "nestjs-typegoose"
import { Model } from "mongoose"
import { ActionsService } from "apps/admin/src/actions/actions.service"
import { createActionDto } from "@common/common/dto/create-action.dto"

@ApiTags("操作")
@Crud({
  model: Action,
  routes: {
    create: false,
    findOne: false,
  },
})
@Controller("actions")
export class ActionsController {
  constructor(@InjectModel(Action) private readonly model: Model<Action>, private readonly actionsService: ActionsService) {}

  @Post()
  async create(@Body() dto: createActionDto) {
    return this.actionsService.create(dto)
  }
}
