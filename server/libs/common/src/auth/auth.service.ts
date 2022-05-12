import { forgetPasswordDto } from './../dto/forget-password.dto';
import { Model } from 'mongoose';
import { EmailCode, EmailCodeDocument } from '@db/db/models/email-code';
import { User, UserDocument } from '@db/db/models/user.model';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { InjectModel } from 'nestjs-typegoose';
import { emailDto } from '../dto/email.dto';
import { registerDto } from '../dto/register.dto';
import { DocumentType } from '@typegoose/typegoose';
import { Status } from '@common/common/enum/mogno.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectModel(EmailCode) private readonly emailCodeModel: Model<EmailCode>,
    @InjectModel(User) private readonly userModel: Model<User>
  ) {}

  /**
   * 登录
   * @param dto
   * @returns
   */
  async login(dto: UserDocument) {
    const payload = { id: dto._id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * 获取用户个人信息
   */
  async getUserProfile(user: DocumentType<User>) {
    return this.userModel.aggregate([
      {
        $match: { _id: user._id },
      },
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'author',
          as: 'articles',
          pipeline: [
            {
              $match: {
                status: Status.ISSUE,
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$articles',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'author',
          as: 'likes',
          pipeline: [
            {
              $match: {
                status: Status.ISSUE,
              },
            },
            {
              $lookup: {
                from: 'actions',
                localField: '_id',
                foreignField: 'object_id',
                as: 'likes',
                pipeline: [
                  {
                    $match: {
                      action_type: 'Like',
                      status: 1,
                    },
                  },
                  {
                    $count: 'count',
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$likes',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $set: {
          likes: {
            $reduce: {
              input: '$likes',
              initialValue: { count: 0 },
              in: {
                count: {
                  $add: ['$$value.count', { $ifNull: ['$$this.likes.count', 0] }],
                },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'articles',
          localField: '_id',
          foreignField: 'author',
          as: 'browsers',
          pipeline: [
            {
              $match: {
                status: Status.ISSUE,
              },
            },
            {
              $lookup: {
                from: 'actions',
                localField: '_id',
                foreignField: 'object_id',
                as: 'browsers',
                pipeline: [
                  {
                    $match: {
                      action_type: 'Browse',
                    },
                  },
                  {
                    $count: 'count',
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$browsers',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
      {
        $set: {
          browsers: {
            $reduce: {
              input: '$browsers',
              initialValue: { count: 0 },
              in: {
                count: { $add: ['$$value.count', { $ifNull: ['$$this.browsers.count', 0] }] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'blogrolls',
          localField: '_id',
          foreignField: 'user',
          as: 'blogroll',
        },
      },
      {
        $unwind: {
          path: '$blogroll',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'role',
          pipeline: [
            {
              $lookup: {
                from: 'menus',
                localField: 'menu_id',
                foreignField: '_id',
                as: 'menu_id',
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$role',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }

  /**
   * 注册
   * @param dto
   */
  async register(dto: registerDto) {
    const emailCode = await this.checkEmailCodeIsCorrect(dto);
    if (await this.checkUserNameIsExists(dto)) throw new HttpException('用户已存在', HttpStatus.FORBIDDEN);
    if (await this.checkEmailIsExists(dto)) throw new HttpException('该邮箱已被其他用户注册', HttpStatus.FORBIDDEN);
    if (await this.checkPasswordWithPasswordConfirmationAreConsistent(dto)) throw new HttpException('两次密码不一致', HttpStatus.FORBIDDEN);
    if (await this.checkEmailCodeAreLate(emailCode)) throw new HttpException('验证码已过期，请重新获取', HttpStatus.FORBIDDEN);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, password_confirmation, ...payload } = dto;
    return this.userModel.create(payload);
  }

  /**
   * 发送邮箱验证码
   * @param data
   */
  async emailSendCode(data: emailDto) {
    try {
      const code = Math.random().toString().slice(-4);
      const date = dayjs(Date.now()).format('YYYY-MM-DD hh:mm:ss');
      const email = (await this.emailCodeModel.where({ email: data.email }).findOne().lean()) as EmailCodeDocument;
      // mail配置
      const sendMailOptions: ISendMailOptions = {
        to: data.email,
        subject: '用户邮箱验证',
        template: 'validate.code.ejs',
        context: {
          code, //验证码
          date, //日期
          sign: '系统邮件,回复无效。',
        },
      };
      if (!(await this.checkEmailCodeAreLate(email))) {
        throw new HttpException('请勿重复发送，一分钟之后重试', HttpStatus.FORBIDDEN);
      }
      this.mailerService
        .sendMail(sendMailOptions)
        .then(async () => {
          email
            ? await this.emailCodeModel.findByIdAndUpdate(email._id, { code, sendDate: Date.now() })
            : await this.emailCodeModel.create({ email: data.email, code, sendDate: Date.now() });
        })
        .catch((error) => {
          console.log(`发送邮件给:${data.email}出错!主题:默认`, error);
        });
      return { code };
    } catch (error) {
      console.error('发送邮件出错:', error);
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  /**
   * 检测用户名是否已被注册
   * @param dto
   */
  async checkUserNameIsExists(dto: registerDto) {
    return this.userModel.findOne({ username: dto.username });
  }

  /**
   * 检测密码及确认密码是否一致
   * @param dto
   */
  async checkPasswordWithPasswordConfirmationAreConsistent(dto: registerDto | forgetPasswordDto) {
    return dto.password !== dto.password_confirmation;
  }

  /**
   * 校验邮箱是否已被注册
   * @param dto
   */
  async checkEmailIsExists(dto: emailDto) {
    return this.userModel.findOne({ email: dto.email }).lean();
  }

  /**
   * 检测验证码是否正确
   * @param dto
   */
  async checkEmailCodeIsCorrect(dto: registerDto | forgetPasswordDto) {
    const emailCode = await this.emailCodeModel.findOne({ email: dto.email, code: dto.code }).lean();
    if (!emailCode) throw new HttpException('验证码错误', HttpStatus.FORBIDDEN);
    return emailCode;
  }

  /**
   * 检测验证码是否过期
   * @param emailCode
   */
  async checkEmailCodeAreLate(emailCode: EmailCode) {
    if (!emailCode) return true;
    const date = Number(emailCode?.sendDate);
    console.log(date, Date.now());
    const currentDate = Date.now();
    if (date + 1000 * 60 - currentDate < 0) {
      await this.clearEmailCode(emailCode);
      return true;
    }
    return false;
  }

  /**
   * 清除验证码
   * @param emailCode
   * @returns
   */
  async clearEmailCode(emailCode: EmailCode) {
    return this.emailCodeModel.findByIdAndUpdate((emailCode as DocumentType<EmailCode>)._id, { code: null });
  }

  /**
   * 重置密码
   * @param dto
   */
  async resetPassword(dto: forgetPasswordDto) {
    const user = await this.checkEmailIsExists(dto);
    if (!user) throw new HttpException('邮箱未注册', HttpStatus.FORBIDDEN);
    const emailCode = await this.checkEmailCodeIsCorrect(dto);
    if (await this.checkEmailCodeAreLate(emailCode)) throw new HttpException('验证码已过期，请重新获取', HttpStatus.FORBIDDEN);
    await this.checkPasswordWithPasswordConfirmationAreConsistent(dto);
    return this.userModel.findByIdAndUpdate(user._id, { password: dto.password });
  }
}
