import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { Status } from '@common/common/enum/mogno.enum';
import * as Mongoose from 'mongoose';
import { Action } from '@db/db/models/action.model';
import { User } from '@db/db/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Action) private readonly actionModel: Model<Action>,
    @InjectModel(User) private readonly userModel: Model<User>
  ) {}

  async getCollection(id: string) {
    return this.actionModel.aggregate([
      {
        $match: {
          user: new Mongoose.Types.ObjectId(id),
          action_type: 'Collect',
          status: 1,
        },
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'object_id',
          foreignField: '_id',
          as: 'article',
          pipeline: [
            {
              $match: {
                status: Status.ISSUE,
              },
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $unwind: {
                path: '$category',
              },
            },
            {
              $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags',
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$article',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  async updateCollection(id: string, body: any) {
    return this.actionModel.findByIdAndUpdate(id, body);
  }

  async findOne(id: string) {
    let userId;
    try {
      userId = new Mongoose.Types.ObjectId(id);
    } catch (err) {
      throw new HttpException('用户ID不合法', 400);
    }
    const user = await this.userModel
      .aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: 'articles',
            localField: '_id',
            foreignField: 'author',
            as: 'articles',
            pipeline: [
              {
                $match: {
                  status: Status.ISSUE,
                },
              },
              {
                $count: 'count',
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$articles',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'articles',
            localField: '_id',
            foreignField: 'author',
            as: 'likes',
            pipeline: [
              {
                $match: {
                  status: Status.ISSUE,
                },
              },
              {
                $lookup: {
                  from: 'actions',
                  localField: '_id',
                  foreignField: 'object_id',
                  as: 'likes',
                  pipeline: [
                    {
                      $match: {
                        action_type: 'Like',
                        status: 1,
                      },
                    },
                    {
                      $count: 'count',
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: '$likes',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $set: {
            likes: {
              $reduce: {
                input: '$likes',
                initialValue: { count: 0 },
                in: {
                  count: {
                    $add: ['$$value.count', { $ifNull: ['$$this.likes.count', 0] }],
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'articles',
            localField: '_id',
            foreignField: 'author',
            as: 'browsers',
            pipeline: [
              {
                $match: {
                  status: Status.ISSUE,
                },
              },
              {
                $lookup: {
                  from: 'actions',
                  localField: '_id',
                  foreignField: 'object_id',
                  as: 'browsers',
                  pipeline: [
                    {
                      $match: {
                        action_type: 'Browse',
                      },
                    },
                    {
                      $count: 'count',
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: '$browsers',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $set: {
            browsers: {
              $reduce: {
                input: '$browsers',
                initialValue: { count: 0 },
                in: {
                  count: { $add: ['$$value.count', { $ifNull: ['$$this.browsers.count', 0] }] },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'blogrolls',
            localField: '_id',
            foreignField: 'user',
            as: 'blogroll',
          },
        },
        {
          $unwind: {
            path: '$blogroll',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [
              {
                $lookup: {
                  from: 'menus',
                  localField: 'menu_id',
                  foreignField: '_id',
                  as: 'menu_id',
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$role',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .catch((err) => {
        console.log(err);
        throw new HttpException('用户不存在', 404);
      });
    return user[0];
  }
}
