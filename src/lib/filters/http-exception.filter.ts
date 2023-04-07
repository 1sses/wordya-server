import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { answerType } from '../answers';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      ok: false,
      statusCode: status,
      message: exception.message,
      error: {
        original: exception.cause,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    } as answerType);
  }
}
