import { ApiProperty } from "@nestjs/swagger"
import { DocumentType, ModelOptions, prop } from "@typegoose/typegoose"

export type EmailCodeDocument = DocumentType<EmailCode>

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class EmailCode {
  @ApiProperty({ description: "用户邮箱" })
  @prop({ required: true, unique: true, match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ })
  email: string

  @ApiProperty({ description: "发送时间" })
  @prop({ required: true })
  sendDate: string

  @ApiProperty({ description: "验证码" })
  @prop({ required: true })
  code: number
}
