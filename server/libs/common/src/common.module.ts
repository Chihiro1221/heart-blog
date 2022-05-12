import { Global, Module } from "@nestjs/common"
import { CommonService } from "./common.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import config from "./config"
import { MulterModule } from "@nestjs/platform-express"
import { envEnum } from "@common/common/enum/env.enum"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MAO = require("multer-aliyun-oss")

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          storage: MAO({
            config: configService.get(envEnum.UPLOAD_STORE),
          }),
        }
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    AuthModule,
  ],
  providers: [CommonService],
  exports: [CommonService, MulterModule],
})
export class CommonModule {}
