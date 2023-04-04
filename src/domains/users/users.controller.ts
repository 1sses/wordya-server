import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../lib/guards/auth.guard';
import { answers, answerType } from '../../lib/answers';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<answerType> {
    const data = await this.usersService.findAll();
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: answers.success.user.getAll,
      data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<answerType> {
    const data = await this.usersService.findOne(id);
    return {
      ok: true,
      statusCode: HttpStatus.OK,
      message: answers.success.user.getOne,
      data,
    };
  }
}
