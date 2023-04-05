import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FiveInARowService } from './five-in-a-row.service';
import { answerType } from '../../lib/answers';
import { AuthGuard } from '../../lib/guards/auth.guard';
import { CheckWordDto } from './dto/check-word.dto';

@Controller('five-in-a-row')
@UseGuards(AuthGuard)
export class FiveInARowController {
  constructor(private readonly fiveInARowService: FiveInARowService) {}

  @Get('start')
  async start(@Param('userId') userId: number): Promise<answerType> {
    const result = await this.fiveInARowService.start(userId);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: { ...result },
    };
  }

  @Post('check-word')
  async checkWord(
    @Param('userId') userId: number,
    @Body() checkWordDto: CheckWordDto,
  ): Promise<answerType> {
    const result = await this.fiveInARowService.checkWord(userId, checkWordDto);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: { ...result },
    };
  }

  @Get('end')
  async end(@Param('userId') userId: number): Promise<answerType> {
    const endData = await this.fiveInARowService.end(userId);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: { ...endData },
    };
  }

  @Get('/statistics')
  async statistics(@Param('userId') userId: number): Promise<answerType> {
    const statistics = await this.fiveInARowService.statistics(userId);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: { ...statistics },
    };
  }
}
