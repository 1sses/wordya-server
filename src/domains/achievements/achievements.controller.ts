import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { answerType } from '../../lib/answers';
import { AuthGuard } from '../../lib/guards/auth.guard';

@Controller('achievements')
@UseGuards(AuthGuard)
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('')
  async findAll(@Param('userId') userId: number): Promise<answerType> {
    const achievements = await this.achievementsService.findAll(userId);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: achievements,
    };
  }
}
