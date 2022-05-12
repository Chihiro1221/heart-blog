import { CommentsService } from './comments.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Crud } from 'nestjs-mongoose-crud';
import { Comment } from '@db/db/models/comment.model';
import { InjectModel } from 'nestjs-typegoose';
import { Model } from 'mongoose';
import { getUserDecorator } from '@common/common/decorator/getUser.decorator';
import { UserDocument } from '@db/db/models/user.model';
import { createActionDto } from '@common/common/dto/create-action.dto';
import { Roles } from '@common/common/decorator/role.decorator';
import { RoleEnum } from '@common/common/enum/role.enum';

@ApiTags('评论')
@ApiBearerAuth()
@Crud({
  model: Comment,
  routes: {
    create: false,
  },
})
@Controller('comments')
@Roles(RoleEnum.SuperAdmin, RoleEnum.Admin)
export class CommentsController {
  constructor(@InjectModel(Comment) private readonly model: Model<Comment>, private readonly commentService: CommentsService) {}

  @Post()
  async create(@getUserDecorator() user: UserDocument, @Body() dto: createActionDto) {
    return this.commentService.create(user, dto);
  }
}
