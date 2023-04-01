import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import { answers } from '../../lib/answers';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register({ email, password, name }: RegisterDto): Promise<User> {
    const isAlreadyExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (isAlreadyExist) {
      throw new BadRequestException(answers.error.user.alreadyExists);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
  }

  async login({ email, password }: LoginDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException(answers.error.user.notFound);
    }
    const isPasswordValid = await bcrypt.compare(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(answers.error.user.badCredentials);
    }
    return user;
  }
}
