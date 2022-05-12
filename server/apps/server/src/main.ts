import { HttpExceptionFilter } from '@common/common/filter/http-exception.filter';
import { TransformInterceptor } from '@common/common/interceptor/transform.interceptor';
import setupSwagger from '@common/common/utils/setupSwagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var history = require('connect-history-api-fallback');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // 使用history路由模式
  app.use(history());
  // interceptor
  app.useGlobalInterceptors(new TransformInterceptor());
  // filter
  app.useGlobalFilters(new HttpExceptionFilter());
  // validator
  app.useGlobalPipes(new ValidationPipe());
  // prefix
  app.setGlobalPrefix('api');
  // swagger
  setupSwagger(app, {
    title: '博客前端API',
    description: '用于博客前端页面接口服务',
  });

  const port = process.env.SERVER_PORT || 3011;
  await app.listen(port);
  console.log(`nest server running at http://localhost:${port}/api/docs`);
}
bootstrap();
