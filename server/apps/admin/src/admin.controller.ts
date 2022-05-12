import { ApiOperation, ApiTags } from "@nestjs/swagger"
import { ApiImplicitFile } from "@nestjs/swagger/dist/decorators/api-implicit-file.decorator"
import { Controller, Get, HttpException, Post, UploadedFile, UseInterceptors } from "@nestjs/common"
import { AdminService } from "./admin.service"
import { FileInterceptor } from "@nestjs/platform-express"

@ApiTags("默认")
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getHello(): string {
    return this.adminService.getHello()
  }

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
