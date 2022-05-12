import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Article } from './article.model';
import { Album } from '@db/db/models/album.model';
import { User } from '@db/db/models/user.model';

export type CommentDcoument = DocumentType<Comment>;

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
})
export class Comment {
  @prop({
    ref: User,
    required: true,
  })
  @ApiProperty({ description: '用户' })
  user: Ref<User>;

  @prop({ maxlength: 100, required: true })
  @ApiProperty({ description: '评论内容' })
  content: string;

  @prop({ required: true, enum: ['Article', 'Album', 'Blogroll', 'Comment'] })
  @ApiProperty({ description: '评论对象的类型' })
  action_object_type: string;

  @prop({ refPath: 'action_object_type' })
  @ApiProperty({ description: '评论对象的objectId' })
  object_id: Ref<Article | Album>;

  @prop({ default: 1, enum: [0, 1] })
  @ApiProperty({ description: '是否显示' })
  is_show: number;

  @prop({ ref: Comment })
  @ApiProperty({ description: '上级评论' })
  parent: Ref<Comment>;
}
