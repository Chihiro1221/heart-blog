import { Module } from "@nestjs/common"
import { AlbumService } from "apps/admin/src/album/album.service"
import { AlbumController } from "./album.controller"

@Module({
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
