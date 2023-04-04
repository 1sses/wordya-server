import { IsNotEmpty, IsString } from 'class-validator';

export class CheckWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;
}
