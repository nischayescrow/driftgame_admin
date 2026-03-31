import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailLoginDto } from './dto/emailLogin.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verify/me')
  @HttpCode(HttpStatus.OK)
  async verifyMe() {
    return {
      ok: true,
    };
  }

  @Post('signup/email')
  @HttpCode(HttpStatus.CREATED)
  async signupWithEmail(@Body() createUserDto: CreateUserDto) {
    return this.authService.singupWithEmail(createUserDto);
  }

  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(
    @Body() emailLoginDto: EmailLoginDto,
    @Res() res: Response,
  ) {
    const loginRes = await this.authService.loginWithEmail(emailLoginDto);

    // console.log('loginRes: ', loginRes);

    if (!loginRes || !loginRes.access_token || !loginRes.refresh_token) {
      throw new InternalServerErrorException('Failed to login!');
    }

    const refresh_token_expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    res.cookie('refresh_token', loginRes.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV! === 'production',
      sameSite: process.env.NODE_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: refresh_token_expires,
    });

    return res.json({
      message: loginRes.message,
      access_token: loginRes.access_token,
      data: loginRes.data,
    });
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    if (!refresh_token) {
      throw new UnauthorizedException();
    }

    const refreshRes = await this.authService.refreshToken(refresh_token);

    // console.log('refreshRes: ', refreshRes);

    if (!refreshRes || !refreshRes.access_token || !refreshRes.refresh_token) {
      throw new InternalServerErrorException('Failed to refresh!');
    }

    const refresh_token_expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );

    res.cookie('refresh_token', refreshRes.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV! === 'production',
      sameSite: process.env.NODE_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: refresh_token_expires,
    });

    return res.json({
      message: refreshRes.message,
      access_token: refreshRes.access_token,
      data: refreshRes.data,
    });
  }

  @Get('logout')
  @HttpCode(HttpStatus.CREATED)
  async logoutUser(@Req() req: Request) {
    if (!req.user) {
      throw new UnauthorizedException('Session expired, Please login again!');
    }

    return this.authService.logout(req.user.id);
  }
}
