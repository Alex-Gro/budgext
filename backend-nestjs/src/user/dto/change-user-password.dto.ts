import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
