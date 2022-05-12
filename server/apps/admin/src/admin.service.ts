import { HttpException, Injectable } from "@nestjs/common"

@Injectable()
export class AdminService {
  getHello(): string {
    return "Hello World!"
  }

  upload(file) {
    if (!file) throw new HttpException("请上传文件", 400)
    file.url = `https://heart-blog.oss-cn-beijing.aliyuncs.com/${file.filename}`
    return file
  }
}
