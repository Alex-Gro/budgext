import { Body, Controller, Post } from '@nestjs/common';
import {AuthService} from "./auth.service";
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // DTO - Data Transfer Object: Transfer data between different layers of an application (Pattern)
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}