import { ApiProperty } from '@nestjs/swagger';
import { ModelOptions, prop, Ref } from '@typegoose/typegoose';

enum Tinyint {
  false = 0,
  true = 1,
}
@ModelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
export class Menu {
  @prop({ required: true, unique: true })
  @ApiProperty({ description: '菜单名称', required: true, uniqueItems: true })
  name: string;

  @prop({ required: true })
  @ApiProperty({ description: '页面地址', required: true })
  page_url: string;

  @prop()
  @ApiProperty({ description: '控件地址', required: true })
  control_url: string;

  @prop({ ref: () => Menu })
  @ApiProperty({ description: '上级菜单' })
  parent: Ref<Menu>;

  @prop()
  @ApiProperty({ description: '层级' })
  level: number;

  @prop({ enum: Tinyint, default: 1 })
  @ApiProperty({ description: '是否显示', default: 1 })
  is_show: Tinyint;

  @prop({ enum: Tinyint, default: 1 })
  @ApiProperty({ description: '是否启用', default: 1 })
  is_enabled: Tinyint;
}
