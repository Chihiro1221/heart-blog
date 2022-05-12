import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common"
import { AppService } from "./app.service"
import { AdminService } from "../../admin/src/admin.service"
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller()
@ApiTags("默认")
export class AppController {
  constructor(private readonly appService: AppService, private readonly adminService: AdminService) {}

  @Post("upload")
  @ApiImplicitFile({
    name: "头像",
    description: "上传头像",
    required: true,
  })
  @ApiOperation({ summary: "上传图片" })
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file) {
    return this.adminService.upload(file)
  }
}
