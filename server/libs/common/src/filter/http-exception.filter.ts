import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common"
import { Response } from "express"

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const resultResponse = exception.getResponse() as any
    const status = exception.getStatus()
    const error = exception.name
    let message = typeof resultResponse.message === "object" ? resultResponse.message : exception.message
    if (exception.name === "ForbiddenException") {
      message = "权限不足!，请联系管理员"
    } else if (exception.name === "UnauthorizedException") {
      message = "请您登陆!"
    }
    response.status(status).json({
      code: -1,
      status: status,
      message,
      type: "error",
      timestamp: new Date().toISOString(),
      error,
    })
  }
}
