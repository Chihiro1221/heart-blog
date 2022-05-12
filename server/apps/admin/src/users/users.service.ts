import { Model } from "mongoose"
import { User } from "@db/db/models/user.model"
import { HttpException, Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import userDto from "@common/common/dto/user.dto"
import { compareSync } from "bcryptjs"

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: Model<User>) {}

  async deleteMany(dto) {
    for (const item of dto) {
      await this.userModel.findByIdAndDelete(item).lean()
    }
    return []
  }

  async update(dto: userDto, id: string) {
    if (dto.password && dto.rawPassword && dto.password === dto.reNewPassword) {
      const user = await this.userModel.findById<User>(id).select("+password")
      const isValid = compareSync(dto.rawPassword, user.password)
      if (!isValid) {
        throw new HttpException("旧密码错误!", 403)
      }
    }
    return this.userModel.findByIdAndUpdate(id, dto)
  }
}
