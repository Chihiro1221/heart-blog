import { Model } from "mongoose"
import { Menu } from "@db/db/models/menu.model"
import { Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"

@Injectable()
export class MenusService {
  constructor(@InjectModel(Menu) private readonly menuModel: Model<Menu>) {}

  async find(query) {
    if (query.tree) {
      const menus = this.menuModel.aggregate([
        {
          $match: {
            parent: null,
          },
        },
        {
          $addFields: {
            level: 1,
          },
        },
        {
          $lookup: {
            from: "menus",
            localField: "_id",
            foreignField: "parent",
            as: "children",
            pipeline: [
              {
                $addFields: {
                  level: 2,
                },
              },
              {
                $lookup: {
                  from: "menus",
                  localField: "_id",
                  foreignField: "parent",
                  as: "children",
                  pipeline: [
                    {
                      $addFields: {
                        level: 3,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ])
      return menus
    } else {
      const menus = this.menuModel.find().populate("parent")
      return menus
    }
  }

  async deleteMany(dto) {
    for (const item of dto) {
      await this.menuModel.findByIdAndDelete(item).lean()
    }
    return []
  }
}
