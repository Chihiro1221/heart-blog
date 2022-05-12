import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop } from '@typegoose/typegoose';

export type TagDocument = DocumentType<Tag>;

enum Tinyint {
  false = 0,
  true = 1,
}

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Tag {
  @prop({ required: true, unique: true })
  @ApiProperty({ description: '标签名称' })
  name: string;

  @prop({ defualt: '#95a5a6' })
  @ApiProperty({ description: '标签主题' })
  color: string;

  @prop({ enum: Tinyint, default: 1 })
  @ApiProperty({ description: '是否启用' })
  is_enabled: Tinyint;
}
