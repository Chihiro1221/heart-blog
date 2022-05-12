import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"
export class emailDto {
  @ApiProperty({ description: "用户邮箱" })
  @IsNotEmpty({ message: "邮件地址是必须的" })
  @IsEmail({ message: "邮件地址格式不正确" })
  email: string
}
