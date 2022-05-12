import { Model } from "mongoose"
import { Category } from "@db/db/models/category.model"
import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private readonly categoryModel: Model<Category>) {}

  async find(query) {
    if (query.tree) {
      return this.categoryModel.aggregate([
        {
          $match: {
            is_enabled: 1,
          },
        },
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
            from: "categories",
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
                  from: "categories",
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
    } else {
      return this.categoryModel.find().populate("parent")
    }
  }

  async update(id: string, dto) {
    if (id === dto.parent) {
      throw new HttpException("无法选择本身", HttpStatus.FORBIDDEN)
    }
    return this.categoryModel.findByIdAndUpdate(id, dto)
  }

  async deleteMany(dto) {
    for (const item of dto) {
      await this.categoryModel.findByIdAndDelete(item).lean()
    }
    return []
  }
}
