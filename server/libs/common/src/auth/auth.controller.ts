import { emailDto } from './../dto/email.dto';
import { AuthService } from './auth.service';
import { loignDto } from './../dto/login.dto';
import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@common/common/decorator/public.decorator';
import { registerDto } from '../dto/register.dto';
import { forgetPasswordDto } from '../dto/forget-password.dto';

@Controller('auth')
@ApiTags('鉴权')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email')
  @ApiOperation({ summary: '发送邮箱验证码' })
  async emailSendCode(@Body() dto: emailDto) {
    await this.authService.checkEmailIsExists(dto);
    return this.authService.emailSendCode(dto);
  }

  @Post('register')
  @ApiOperation({ summary: '注册' })
  async register(@Body() dto: registerDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: loignDto })
  @Public()
  @ApiOperation({ summary: '登录' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('forget-password')
  @ApiOperation({ summary: '重置密码' })
  async forgetPassword(@Body() dto: forgetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户个人信息' })
  async getProfile(@Request() req) {
    return (await this.authService.getUserProfile(req.user))[0];
  }
}
