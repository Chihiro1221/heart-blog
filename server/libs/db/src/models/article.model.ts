import { ApiProperty } from "@nestjs/swagger"
import { ModelOptions, prop, Ref } from "@typegoose/typegoose"
import { Category } from "./category.model"
import { Tag } from "./tag.model"
import { User } from "./user.model"
import { Action } from "@db/db/models/action.model"

enum Status {
  ISSUE = "issue",
  PRIVATE = "private",
  DRAFT = "draft",
  RECYCLE = "recycle",
}

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
export class Article {
  @prop({ required: true, maxlength: 30 })
  @ApiProperty({ description: "文章标题" })
  title: string

  @prop({ required: true })
  @ApiProperty({ description: "文章内容" })
  content: string

  @prop({ enum: Status, default: Status.PRIVATE })
  @ApiProperty({ description: "文章状态" })
  status: Status

  @prop({ enum: [0, 1], default: 0 })
  @ApiProperty({ description: "是否置顶" })
  is_stick: number

  @prop()
  @ApiProperty({ description: "文章封面" })
  cover: string

  @prop({ ref: User })
  @ApiProperty({ description: "作者" })
  author: Ref<User>

  @prop({ ref: Category })
  @ApiProperty({ description: "分类" })
  category: Ref<Category>

  @prop({
    ref: Tag,
    validate: {
      validator: (v) => {
        return v.length <= 5
      },
      message: "最多选择5个标签!",
    },
  })
  @ApiProperty({ description: "标签" })
  tags: Ref<Tag>[]

  @prop({
    ref: Action,
    localField: "_id",
    foreignField: "object_id",
    options: {
      match: {
        action_type: "Like",
        status: 1,
      },
      populate: "user",
    },
  })
  likes: Ref<Action>[]

  @prop({
    ref: Action,
    localField: "_id",
    foreignField: "object_id",
    options: {
      match: {
        action_type: "Collect",
        status: 1,
      },
      populate: "user",
    },
  })
  collects: Ref<Action>[]

  @prop({
    ref: Action,
    localField: "_id",
    foreignField: "object_id",
    options: {
      match: {
        action_type: "Browse",
      },
    },
  })
  browsers: Ref<Action>[]
}
