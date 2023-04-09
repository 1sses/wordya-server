import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FiveInARowService } from './five-in-a-row.service';
import { answerType } from '../../lib/answers';
import { AuthGuard } from '../../lib/guards/auth.guard';
import { CheckWordDto } from './dto/check-word.dto';
import { StartDto } from './dto/start.dto';
import { EndDto } from './dto/end.dto';

@Controller('five-in-a-row')
@UseGuards(AuthGuard)
export class FiveInARowController {
  constructor(private readonly fiveInARowService: FiveInARowService) {}

  @Post('start')
  async start(
    @Param('userId') userId: number,
    @Body() startDto: StartDto,
  ): Promise<answerType> {
    const result = await this.fiveInARowService.start(userId, startDto);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: '',
      data: { ...result },
    };
  }

  @Patch('check-word')
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

  @Patch('end')
  async end(
    @Param('userId') userId: number,
    @Body() endDto: EndDto,
  ): Promise<answerType> {
    const endData = await this.fiveInARowService.end(userId, endDto);
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
