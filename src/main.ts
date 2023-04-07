import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { AppModule } from './app.module';
import { PrismaService } from './lib/prisma/prisma.service';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './lib/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ credentials: true, origin: process.env.ORIGIN });
  app.use(helmet());
  app.use(cookieParser());
  // app.use(csurf());
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT);
  console.log('App is started!');
}
bootstrap();
