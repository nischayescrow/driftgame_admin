import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  Res,
  UnauthorizedException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EmailLoginDto } from './dto/emailLogin.dto';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/google')
  @HttpCode(HttpStatus.CREATED)
  async signupWithGoogle(@Req() req: Request) {
    const authCode = req.headers.authorization;

    if (!authCode) {
      throw new UnauthorizedException('Unauthorized request!');
    }

    return this.authService.singupWithGoogle(authCode);
  }

  @Post('signup/email')
  @HttpCode(HttpStatus.CREATED)
  async signupWithEmail(@Body() createUserDto: CreateUserDto) {
    return this.authService.singupWithEmail(createUserDto);
  }

  @Get('login/google')
  @HttpCode(HttpStatus.OK)
  async loginWithGoogle(@Req() req: Request, @Res() res: Response) {
    const authCode = req.headers.authorization;

    console.log('authCode: ', authCode);

    if (!authCode) {
      throw new UnauthorizedException('Unauthorized request!');
    }

    const loginRes = await this.authService.loginWithGoogle(authCode);

    if (!loginRes || !loginRes.access_token || !loginRes.refresh_token) {
      throw new InternalServerErrorException('Failed to login!');
    }

    const access_token_expires = new Date(
      Date.now() + parseInt(process.env.ACCESS_EXPIRES_AT!),
    );

    res.cookie('access_token', loginRes.access_token, {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: access_token_expires,
    });

    const refresh_token_expires = new Date(
      Date.now() + parseInt(process.env.ACCESS_EXPIRES_AT!),
    );

    res.cookie('refresh_token', loginRes.refresh_token, {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: refresh_token_expires,
    });

    return res.json({
      message: loginRes.message,
      access_token: loginRes.access_token,
      user: loginRes.user,
    });
  }

  @Post('login/email')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(
    @Res() res: Response,
    @Body() emailLoginDto: EmailLoginDto,
  ) {
    const loginRes = await this.authService.loginWithEmail(emailLoginDto);

    if (!loginRes || !loginRes.access_token || !loginRes.refresh_token) {
      throw new InternalServerErrorException('Failed to login!');
    }

    const access_token_expires = new Date(
      Date.now() + parseInt(process.env.ACCESS_EXPIRES_AT!),
    );

    res.cookie('access_token', loginRes.access_token, {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: access_token_expires,
    });

    const refresh_token_expires = new Date(
      Date.now() + parseInt(process.env.ACCESS_EXPIRES_AT!),
    );

    res.cookie('refresh_token', loginRes.refresh_token, {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: refresh_token_expires,
    });

    return res.json({
      message: loginRes.message,
      access_token: loginRes.access_token,
      user: loginRes.user,
    });
  }
}
