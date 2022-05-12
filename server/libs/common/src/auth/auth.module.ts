import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { envEnum } from '../enum/env.enum';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('env').JWT_SCRET ?? 'adifjdkfksadjklfjkdsal',
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return configService.get(envEnum.EMAIL);
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
