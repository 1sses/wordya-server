import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.achievement.findMany({
      where: { profile: { userId } },
    });
  }
}
