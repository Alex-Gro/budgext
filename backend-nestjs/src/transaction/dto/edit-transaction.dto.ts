import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EditTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  amount?: number;

  @IsNotEmpty()
  @IsOptional()
  type?: string; // 'income', 'expense' - evtl enum?

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}