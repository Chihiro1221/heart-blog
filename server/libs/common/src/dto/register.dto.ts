import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';

export class registerDto {
  @IsNotEmpty({ message: '用户名是必须的' })
  @MinLength(5, { message: '用户名最少5位' })
  @MaxLength(8, { message: '用户名最大8位' })
  @ApiProperty({ description: '用户名' })
  username: string;

  @IsNotEmpty({ message: '密码是必须的' })
  @MinLength(6, { message: '密码最少6位' })
  @MaxLength(18, { message: '密码最大18位' })
  @ApiProperty({ description: '密码' })
  password: string;

  @IsNotEmpty({ message: '确认密码是必须的' })
  @ApiProperty({ description: '确认密码' })
  password_confirmation: string;

  @IsNotEmpty({ message: '邮件地址是必须的' })
  @IsEmail({}, { message: '邮件地址格式不正确' })
  @ApiProperty({ description: '邮件地址' })
  email: string;

  @IsNotEmpty({ message: '验证码是必须的' })
  @IsInt({ message: '验证码不是合法数字' })
  @ApiProperty({ description: '邮件地址' })
  code: number;
}
