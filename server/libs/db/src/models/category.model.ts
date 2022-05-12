import { ApiProperty } from "@nestjs/swagger"
import { DocumentType, ModelOptions, prop, Ref } from "@typegoose/typegoose"

export type CategoryDocument = DocumentType<Category>

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Category {
  @prop({ required: true, unique: true })
  @ApiProperty({ description: "分类名称" })
  name: string

  @prop({ ref: Category })
  @ApiProperty({ description: "上级分类" })
  parent: Ref<Category>

  @prop({ enum: [0, 1], default: 1 })
  @ApiProperty({ description: "是否启用" })
  is_enabled: number
}
