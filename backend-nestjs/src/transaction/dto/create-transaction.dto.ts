import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  type: string; // 'income', 'expense' - evtl enum?

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;


  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;
}