import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { answers, answerType } from '../../lib/answers';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../../lib/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<answerType> {
    const user = await this.authService.register(registerDto);
    return {
      ok: true,
      statusCode: HttpStatus.CREATED,
      message: answers.success.user.created,
      data: { user },
    };
  }

  @Get('confirm-email/:token')
  async confirmEmail(
    @Param('token') token: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<answerType> {
    const user = await this.authService.confirmEmail({ token });
    response.cookie('jwt', this.jwtService.sign({ id: user.id }), {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    return {
      ok: true,
      statusCode: HttpStatus.CREATED,
      message: answers.success.user.created,
      data: { user },
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(loginDto);
    response.cookie('jwt', this.jwtService.sign({ id: user.id }), {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: answers.success.user.login,
      data: { user },
    };
  }

  @Get('re-authenticate')
  @UseGuards(AuthGuard)
  async reAuthenticate(@Param('userId') userId: number): Promise<answerType> {
    const user = await this.authService.reAuthenticate(userId);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: answers.success.user.login,
      data: { user },
    };
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<answerType> {
    response.cookie('jwt', '');
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: answers.success.user.logout,
    };
  }
}
