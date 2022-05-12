import { User } from '@db/db/models/user.model';
import { PartialType } from '@nestjs/swagger';

export default class userDto extends PartialType(User) {
  rawPassword?: string;
  reNewPassword?: string;
}
