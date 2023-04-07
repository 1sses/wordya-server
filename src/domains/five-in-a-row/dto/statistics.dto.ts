import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class StatisticsDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  difficulty: number;
}
