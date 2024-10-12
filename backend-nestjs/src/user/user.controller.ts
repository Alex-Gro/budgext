import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  // users/me
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe() {
    return 'user info';
  }
}
