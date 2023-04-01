import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as process from 'process';
import { answers } from '../answers';

export const Jwt = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.jwt;
    const jwtService = new JwtService({});
    try {
      const userData = jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      return field ? userData[field] : { id: userData.id };
    } catch (error) {
      throw new UnauthorizedException(answers.error.user.invalidToken);
    }
  },
);
