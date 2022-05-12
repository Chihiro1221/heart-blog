import { Blogroll } from './blogroll.model';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
import { Role } from './role.model';

export type UserDocument = DocumentType<User>;

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  },
})
export class User {
  @prop({ required: true, unique: true, minlength: 5, maxlength: 8 })
  @ApiProperty({
    description: '用户名',
    required: true,
  })
  username: string;

  @prop({
    required: true,
    minlength: 6,
    select: false,
    set(value) {
      // 散列
      return hashSync(String(value));
    },
  })
  @ApiProperty({
    description: '密码',
    required: true,
    minLength: 6,
  })
  password: string;

  @prop({
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 10,
    default: (value) => {
      return value.username;
    },
  })
  @ApiProperty({ description: '昵称' })
  nickname: string;

  @prop()
  @ApiProperty({ description: '头像' })
  avatar: string;

  @prop({ maxlength: 200 })
  @ApiProperty({ description: '简介' })
  description: string;

  @prop()
  @ApiProperty({ description: 'QQ' })
  qq: number;

  @prop({ match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ })
  @ApiProperty({ description: '邮箱' })
  email: string;

  @prop({ enum: [0, 1], default: 1 })
  @ApiProperty({ description: '是否启用', default: 1 })
  is_enabled: number;

  @prop({ ref: Role })
  @ApiProperty({ description: '角色id' })
  role: Ref<Role>;

  @prop({
    ref: Blogroll,
    localField: '_id',
    foreignField: 'user',
  })
  @ApiProperty({ description: '友情链接' })
  blogroll: Ref<Blogroll>;
}
