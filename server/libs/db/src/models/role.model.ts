import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Menu } from './menu.model';

export type RoleDocument = DocumentType<Role>;

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Role {
  @prop({ required: true, unique: true })
  @ApiProperty({ description: '角色名称' })
  name: string;

  @prop({ required: true, unique: true })
  @ApiProperty({ description: '角色昵称' })
  nickname: string;

  @prop({ ref: Menu })
  @ApiProperty({ description: '菜单id集合', type: Menu })
  menu_id: Ref<Menu>[];
}
