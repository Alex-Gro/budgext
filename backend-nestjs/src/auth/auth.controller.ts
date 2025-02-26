import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {AuthService} from "./auth.service";
import { AuthDto } from './dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // DTO - Data Transfer Object: Transfer data between different layers of an application (Pattern)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<{access_token: string, user: User}> {
    return this.authService.signUp(dto);
  }

  // 200 better code than default 201 because we are not creating something
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto): Promise<{access_token: string, user: User}> {
    return this.authService.login(dto);
  }
}