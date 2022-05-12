import { Query } from "@common/common/types/requestParams"
import { Model } from "mongoose"
import { InjectModel } from "nestjs-typegoose"
import { Injectable } from "@nestjs/common"
import { Album } from "@db/db/models/album.model"

@Injectable()
export class AlbumService {
  constructor(@InjectModel(Album) private readonly albumModel: Model<Album>) {}

  async find(query) {
    const { where } = query ? (JSON.parse(query) as Query) : { where: null }
    await this.albumModel.aggregate([
      {
        $lookup: {
          from: "actions",
          localField: "_id",
          foreignField: "object_id",
          pipeline: [
            {
              $match: {
                action_type: "Like",
                status: 1,
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "actions",
          localField: "_id",
          foreignField: "object_id",
          pipeline: [
            {
              $match: {
                action_type: "Browse",
              },
            },
          ],
          as: "browsers",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "object_id",
          as: "comments",
          pipeline: [
            {
              $match: {
                parent: null,
              },
            },
            {
              $graphLookup: {
                from: "comments",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "children",
                depthField: "depth",
              },
            },
            // 排序
            {
              $sort: {
                createdAt: -1,
              },
            },
            // 查询评论用户
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            // 查询点赞数
            {
              $lookup: {
                from: "actions",
                localField: "_id",
                foreignField: "object_id",
                as: "likes",
                pipeline: [
                  {
                    $match: {
                      status: 1,
                    },
                  },
                ],
              },
            },
            // 结构
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $merge: {
          into: "albums",
          on: "_id",
          whenMatched: "replace",
          whenNotMatched: "discard",
        },
      },
    ])
    return {
      data: await this.albumModel.find().where(where).populate("tags"),
      total: await this.albumModel.where(where).countDocuments(),
    }
  }

  async findOne(id: string) {
    return this.albumModel.findById(id).populate("tags")
  }

  async deleteMany(dto) {
    for (const item of dto) {
      await this.albumModel.findByIdAndDelete(item).lean()
    }
    return []
  }
}
