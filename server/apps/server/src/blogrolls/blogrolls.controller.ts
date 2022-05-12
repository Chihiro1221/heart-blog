import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Blogroll } from '@db/db/models/blogroll.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';

@ApiTags('友情链接')
@Crud({
  model: Blogroll,
  routes: {
    delete: false,
  },
})
@Controller('blogrolls')
export class BlogrollsController {
  constructor(@InjectModel(Blogroll) private readonly model: Model<Blogroll>) {}
}
