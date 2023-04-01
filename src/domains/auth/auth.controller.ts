import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { answers, answerType } from '../../lib/answers';
import { Jwt } from '../../lib/decorators/jwt.decorator';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<answerType> {
    const user = await this.authService.register(registerDto);
    response.cookie('jwt', this.jwtService.sign({ id: user.id }), {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.user.created,
      data: { user },
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<answerType> {
    const user = await this.authService.login(loginDto);
    response.cookie('jwt', this.jwtService.sign({ id: user.id }), {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.login,
      data: { user },
    };
  }

  @Get('validate')
  async validate(@Jwt() data: object): Promise<answerType> {
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.login,
      data,
    };
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<answerType> {
    response.cookie('jwt', '');
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.logout,
    };
  }
}
