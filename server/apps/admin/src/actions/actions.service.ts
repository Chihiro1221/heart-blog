import { Model } from "mongoose"
import { createActionDto } from "@common/common/dto/create-action.dto"
import { Action, ActionDocument } from "@db/db/models/action.model"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"

@Injectable()
export class ActionsService {
  constructor(@InjectModel(Action) private readonly actionModel: Model<Action>) {}

  async create(dto: createActionDto) {
    if (dto.action_type !== "Browse") {
      if (!dto.user) throw new HttpException("请先登录", HttpStatus.UNAUTHORIZED)
      const action = (await this.actionModel
        .findOne({
          object_id: dto.object_id,
          user: dto.user,
          action_type: dto.action_type,
        })
        .catch((err) => {
          return {
            code: -1,
            msg: "文章不存在或已被删除",
          }
        })) as ActionDocument
      if (action) {
        const status = action.status ? 0 : 1
        await this.actionModel.findByIdAndUpdate(action._id, {
          status,
        })
        return this.actionModel.findById(action._id)
      }
      return await this.actionModel.create({
        ...dto,
        user: dto.user,
        status: 1,
      })
    }
    return await this.actionModel.create(dto).catch((err) => {
      return null
    })
  }
}
