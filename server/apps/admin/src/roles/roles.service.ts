import { Model } from "mongoose"
import { Role } from "@db/db/models/role.model"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private readonly roleModel: Model<Role>) {}

  async deleteMany(dto) {
    for (const item of dto) {
      await this.roleModel.findByIdAndDelete(item).lean()
    }
    return []
  }
}
