import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CheckWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  difficulty: number;
}
