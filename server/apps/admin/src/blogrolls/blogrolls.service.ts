import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable } from '@nestjs/common';
import { Blogroll } from '@db/db/models/blogroll.model';

@Injectable()
export class BlogrollsService {
  constructor(@InjectModel(Blogroll) private readonly blogrollModel: Model<Blogroll>) {}

  async deleteMany(dto) {
    for (const item of dto) {
      await this.blogrollModel.findByIdAndDelete(item).lean();
    }
    return [];
  }
}
