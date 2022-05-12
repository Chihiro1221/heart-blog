import { ApiTags } from "@nestjs/swagger"
import { Controller, Get, Param, Query } from "@nestjs/common"
import { AlbumService } from "apps/admin/src/album/album.service"
import { Crud } from "nestjs-mongoose-crud"
import { Album } from "@db/db/models/album.model"
import { InjectModel } from "nestjs-typegoose"
import { Model } from "mongoose"

@ApiTags("相册")
@Controller("album")
@Crud({
  model: Album,
  routes: {
    find: false,
    create: false,
    delete: false,
    update: false,
    findOne: false,
  },
})
export class AlbumController {
  constructor(private readonly albumService: AlbumService, @InjectModel(Album) private readonly model: Model<Album>) {}

  @Get()
  async find(@Query() query = {} as any) {
    return await this.albumService.find(query?.query)
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    await this.find()
    return await this.albumService.findOne(id)
  }
}
