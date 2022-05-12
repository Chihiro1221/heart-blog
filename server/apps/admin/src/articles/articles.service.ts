import { Model } from 'mongoose';
import { Article } from '@db/db/models/article.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { createArticleDto } from '@common/common/dto/article.dto';
import { Album } from '@db/db/models/album.model';
import { Status } from '@common/common/enum/mogno.enum';
import { Comment } from '@db/db/models/comment.model';
import { Query } from '@common/common/types/requestParams';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article) private readonly articleModel: Model<Article>,
    @InjectModel(Comment) private readonly commentModel: Model<Comment>,
    @InjectModel(Album) private readonly albumModel: Model<Album>
  ) {}

  async find(query = {} as any) {
    const configuration = {} as Query;
    if (query.query) {
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
    }
    // 聚合查询评论，之后合并到默认查询中
    await this.articleModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'object_id',
          as: 'comments',
          pipeline: [
            {
              $match: {
                parent: null,
                is_show: 1,
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
            // 排序
            {
              $sort: {
                createdAt: -1,
              },
            },
            // 查询评论用户
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
              },
            },
            // 查询点赞数
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
                    $unwind: '$user',
                  },
                ],
              },
            },
            // 结构
            {
              $unwind: '$user',
            },
          ],
        },
      },
      {
        $merge: {
          into: 'articles',
          on: '_id',
          whenMatched: 'merge',
        },
      },
    ]);
    const article = await this.articleModel
      .find()
      .setOptions(configuration)
      .populate('category')
      .populate('tags')
      .populate('author')
      .populate('likes')
      .populate('collects')
      .populate('browsers')
      .sort('-is_stick');
    return {
      data: article,
      lastPage: 1,
      page: configuration.skip ? configuration.skip + 2 : 1,
      total: await this.articleModel.find(configuration.where).countDocuments(),
    };
  }

  async findOneByServer(id: string) {
    return this.articleModel
      .findById(id)
      .where({ is_show: 1 })
      .populate(['author', 'category', 'tags', 'likes', 'collects', 'browsers'] as any)
      .catch((err) => {
        return {
          code: -1,
          msg: '文章不存在或已被删除',
        };
      });
  }

  async findOneByAdmin(id: string) {
    return this.articleModel.findById(id).catch((err) => {
      return {
        code: -1,
        msg: '文章不存在或已被删除',
      };
    });
  }

  async create(user, dto: createArticleDto) {
    // 若是不上传封面则自动从相册随机选择一张
    if (!dto.cover) {
      const albums = await this.albumModel.find().lean();
      const random = Math.floor(Math.random() * albums.length);
      dto.cover = albums[random].picture;
    }
    if (!user) {
      throw new HttpException('请登录!', HttpStatus.FORBIDDEN);
    }
    dto.author = user._id;
    return this.articleModel.create(dto);
  }

  async deleteMany(dto: string[]) {
    const newArticle = [];
    for (const id of dto) {
      const article = await this.articleModel.findById(id);
      article.status = Status.RECYCLE;
      newArticle.push(await this.articleModel.findByIdAndUpdate(id, article));
    }
    return newArticle;
  }

  // 确认删除
  async confirmedDeleteMany(dto) {
    for (const id of dto) {
      await this.articleModel.findByIdAndDelete(id);
    }
    return [];
  }

  // 彻底删除
  async confirmDelete(id: string) {
    return this.articleModel.findByIdAndDelete(id);
  }

  // 批量彻底删除
  async confirmDeleteMany(dto: string[]) {
    for (const id of dto) {
      await this.articleModel.findByIdAndDelete(id);
    }
    return [];
  }

  // 移入回收站
  async recycle(id: string) {
    await this.articleModel.findByIdAndUpdate(id, { status: Status.RECYCLE });
  }

  // 移出回收站
  async moveRecycle(id: string) {
    await this.articleModel.findByIdAndUpdate(id, { status: Status.PRIVATE });
  }

  // 更新
  async update(id: string, dto: createArticleDto) {
    await this.articleModel.findByIdAndUpdate(id, dto);
    return this.findOneByServer(id);
  }
}
