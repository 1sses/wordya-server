import { Controller, Get, Post } from '@nestjs/common';
import { FiveInARowService } from './five-in-a-row.service';

@Controller('five-in-a-row')
export class FiveInARowController {
  constructor(private readonly fiveInARowService: FiveInARowService) {}

  @Get('start')
  async startGame() {}

  @Post('check')
  async checkWord() {}

  @Get('end')
  async endGame() {}
}
