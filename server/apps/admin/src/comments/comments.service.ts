import { Model } from 'mongoose';
import { createActionDto } from '@common/common/dto/create-action.dto';
import { Comment } from '@db/db/models/comment.model';
import { UserDocument } from '@db/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment) private readonly commentModel: Model<Comment>) {}

  async create(user: UserDocument, dto: createActionDto) {
    dto.user = user?._id;
    return await this.commentModel.create(dto);
  }

  async find(query = {} as any) {
    const configuration = {} as any;
    const options = JSON.parse(query.query);

    function excludeNull(newObj, obj) {
      for (const key in obj) {
        if (obj[key]) {
          newObj[key] = obj[key];
          if (typeof obj[key] === 'object') excludeNull(newObj[key], obj[key]);
        }
      }
    }

    excludeNull(configuration, options);
    if (options.page !== 1) {
      configuration.skip = (options.page - 1) * options.limit;
    }

    return this.commentModel.aggregate([
      {
        $match: {
          parent: null,
          is_show: 1,
          action_object_type: 'Blogroll',
        },
      },
      {
        $graphLookup: {
          from: 'comments',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parent',
          as: 'children',
          depthField: 'depth',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
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
                status: 1,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
    ]);
  }
}
