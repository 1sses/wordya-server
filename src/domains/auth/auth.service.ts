import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { answers } from '../../lib/answers';
import { PrismaService } from '../../lib/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { getLink } from '../../lib/utils/getLink';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async register({ email, password, name }: RegisterDto): Promise<User> {
    const isAlreadyExist = await this.prisma.user.findUnique({
      where: { email },
    });
    if (isAlreadyExist) {
      throw new BadRequestException(answers.error.user.alreadyExists);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    await this.prisma.profile.create({ data: { userId: user.id } });
    // const activation = await this.prisma.emailActivation.create({ // TODO: fix mail SPAM
    //   data: { userId: user.id },
    // });
    // void this.mailerService
    //   .sendMail({
    //     to: user.email,
    //     subject: 'Активация аккаунта',
    //     template: 'email-activation',
    //     context: {
    //       name: user.name,
    //       link: getLink({ type: 'confirm-email', token: activation.token }),
    //     },
    //   })
    //   .catch(() => {
    //     throw new BadRequestException('Error sending email');
    //   });
    return user;
  }

  async login({ email, password }: LoginDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(answers.error.user.notFound);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(answers.error.user.badCredentials);
    }
    return user;
  }

  async reAuthenticate(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async confirmEmail({ token }: { token: string }): Promise<User> {
    const activation = await this.prisma.emailActivation.findFirst({
      where: { token },
    });
    if (!activation) {
      throw new BadRequestException(answers.error.unknown);
    }
    const user = await this.prisma.user.update({
      where: { id: activation.userId },
      data: { status: UserStatus.ACTIVE },
    });
    await this.prisma.emailActivation.delete({ where: { id: activation.id } });
    return user;
  }
}
