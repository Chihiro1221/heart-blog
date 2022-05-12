import { AuthGuard } from '@nestjs/passport';
import { createActionDto } from '@common/common/dto/create-action.dto';
import { CommentsService } from 'apps/admin/src/comments/comments.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { getUserDecorator } from '@common/common/decorator/getUser.decorator';
import { UserDocument } from '@db/db/models/user.model';

@ApiTags('评论')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: '获取评论列表' })
  async find(@Query() query?) {
    return this.commentService.find(query);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ description: '发表评论' })
  async create(@Body() dto: createActionDto, @getUserDecorator() user: UserDocument) {
    return this.commentService.create(user, dto);
  }
}
