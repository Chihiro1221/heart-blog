import { Model } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { User } from '@db/db/models/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User) private readonly userModel: Model<User>) {
    super();
  }
  async validate(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).select('+password').select('+is_enabled').lean();
    if (!user) {
      throw new HttpException('用户不存在', 403);
    }
    const isValid = compareSync(pass, user.password);
    if (!isValid) {
      throw new HttpException('密码错误', 403);
    }
    if (user.is_enabled !== 1) {
      throw new HttpException('账号已停用', 403);
    }
    const { password, ...result } = user;

    return result;
  }
}
