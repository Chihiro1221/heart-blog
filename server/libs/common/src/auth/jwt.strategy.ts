import { Model } from 'mongoose';
import { User } from '@db/db/models/user.model';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, @InjectModel(User) private readonly userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('env').JWT_SCRET ?? 'adifjdkfksadjklfjkdsal',
    });
  }

  async validate(payload: { id: string }) {
    const user = this.userModel.findById(payload.id);
    if (!user) {
      throw new HttpException('用户不存在', 401);
    }
    return user;
  }
}
