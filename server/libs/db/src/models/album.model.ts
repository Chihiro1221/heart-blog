import { ApiProperty } from "@nestjs/swagger"
import { DocumentType, ModelOptions, prop, Ref } from "@typegoose/typegoose"
import { Tag } from "./tag.model"

export type AlbumDocument = DocumentType<Album>

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Album {
  @prop({ required: true })
  @ApiProperty({ description: "图片" })
  picture: string

  @prop()
  @ApiProperty({ description: "图片简介" })
  description: string

  @prop({ ref: Tag })
  @ApiProperty({ description: "标签" })
  tags: Ref<Tag>[]
}
