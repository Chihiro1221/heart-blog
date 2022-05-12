import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import setupSwagger from '@common/common/utils/setupSwagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '@common/common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '@common/common/filter/http-exception.filter';

const history = require('connect-history-api-fallback');
async function bootstrap() {
  const app = await NestFactory.create(AdminModule, {
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
    title: '博客后台管理API',
    description: '用于博客后台管理页面api实现',
  });

  const port = process.env.ADMIN_PORT || 3012;
  await app.listen(port);
  console.log(`nest server running at http://localhost:${port}/api/docs`);
}

void bootstrap();
