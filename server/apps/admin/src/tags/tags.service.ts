import { Model } from "mongoose"
import { Tag } from "@db/db/models/tag.model"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private readonly tagModel: Model<Tag>) {}

  async deleteMany(dto) {
    for (const item of dto) {
      await this.tagModel.findByIdAndDelete(item).lean()
    }
    return []
  }
}
