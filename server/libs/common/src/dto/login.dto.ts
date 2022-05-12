import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loignDto {
  @IsNotEmpty({ message: '用户名是必须的' })
  @ApiProperty({ description: '用户名' })
  username: string;

  @IsNotEmpty({ message: '密码是必须的' })
  @ApiProperty({ description: '密码' })
  password: string;
}
