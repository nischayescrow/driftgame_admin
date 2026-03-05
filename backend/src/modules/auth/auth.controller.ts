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

  @Get('verify/me')
  @HttpCode(HttpStatus.OK)
  async verifyMe(@Req() req: Request) {
    if (req.user) {
      return { ok: true };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    console.log('req.cookies: ', req.cookies);
    const refresh_token = req.cookies['refresh_token'];
    console.log('refresh_token', refresh_token);

    const refreshRes = await this.authService.refreshToken(refresh_token);

    console.log('refreshRes: ', refreshRes);

    if (!refreshRes || !refreshRes.access_token || !refreshRes.refresh_token) {
      throw new InternalServerErrorException('Failed to refresh!');
    }

    const refresh_token_expires = new Date(
      Date.now() + parseInt(process.env.REFRESH_EXPIRES_AT!),
    );

    res.cookie('refresh_token', refreshRes.refresh_token, {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      expires: refresh_token_expires,
    });

    return res.json({
      message: refreshRes.message,
      access_token: refreshRes.access_token,
      user: refreshRes.user,
    });
  }

  @Post('signup/email')
  @HttpCode(HttpStatus.CREATED)
  async signupWithEmail(@Body() createUserDto: CreateUserDto) {
    return this.authService.singupWithEmail(createUserDto);
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

    const refresh_token_expires = new Date(
      Date.now() + parseInt(process.env.REFRESH_EXPIRES_AT!),
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

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.session || !req.session.id) {
      throw new UnauthorizedException();
    }

    const logoutRes = await this.authService.logout(req.session.id);

    console.log('logoutRes: ', logoutRes);

    if (!logoutRes) {
      throw new InternalServerErrorException('Failed to logout!');
    }

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.APP_ENV! === 'production',
      sameSite: process.env.APP_ENV! === 'production' ? 'none' : 'strict',
      path: '/',
      maxAge: 0,
    });

    return res.json({
      message: logoutRes.message,
    });
  }
}
