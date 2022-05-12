import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

export type BlogrollDcoument = DocumentType<Blogroll>;

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Blogroll {
  @prop({ required: true })
  @ApiProperty({ description: '友链头像' })
  avatar: string;

  @prop({ required: true })
  @ApiProperty({ description: '网站链接' })
  site: string;

  @prop({ default: '这个人很懒，什么都没有留下~' })
  @ApiProperty({ description: '简介' })
  description: string;

  @prop({ ref: () => User, required: true, unique: true })
  @ApiProperty({ description: '用户id' })
  user: Ref<User>;

  @prop({ enum: [0, 1], default: 0 })
  @ApiProperty({ description: '是否启用' })
  status: number;
}
