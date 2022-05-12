import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Article } from './article.model';
import { Album } from '@db/db/models/album.model';
import { User } from '@db/db/models/user.model';
import { Comment } from '@db/db/models/comment.model';

export type ActionDocument = DocumentType<Action>;

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Action {
  @prop({ required: true, enum: ['Article', 'Album', 'Comment'] })
  @ApiProperty({ description: '操作对象的类型' })
  action_object_type: string;

  @prop({ required: true, refPath: 'action_object_type' })
  @ApiProperty({ description: '操作对象的objectId' })
  object_id: Ref<Article | Album | Comment>;

  @prop({ required: true, enum: ['Like', 'Browse', 'Collect'] })
  @ApiProperty({ description: '操作类型' })
  action_type: string;

  @prop({ ref: User })
  @ApiProperty({ description: '用户id' })
  user: Ref<User>;

  @prop({ enum: [0, 1] })
  @ApiProperty({ description: '状态' })
  status: number;

  @prop({ default: 1, enum: [0, 1] })
  @ApiProperty({ description: '是否显示' })
  is_show: number;
}
