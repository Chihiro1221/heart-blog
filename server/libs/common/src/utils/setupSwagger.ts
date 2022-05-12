import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOption } from '@common/common/types/swaggerOption';
import { INestApplication } from '@nestjs/common';

export default function setupSwagger(
  app: INestApplication,
  config: swaggerOption,
) {
  const options = new DocumentBuilder()
    .setTitle(config.title) // 标题
    .setDescription(config.description) // 描述
    .setVersion('1.0') // 版本
    .addBearerAuth() // 开启添加authorization功能（建议开启）
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      explorer: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        active: true,
        theme: 'tomorrow-night',
      },
    },
  });
}
