import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

// UseGuards on this line means, that everything in UserController is JwtGuarded
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  // users/me
  // UseGuards(JwtGuard) here would JwtGuard just this function
  @HttpCode(HttpStatus.OK)
  @Get('getUser')
  getUser(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('editUser')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('changePw')
  changeUserPassword(@GetUser('id') userId: number, @Body() dto: ChangeUserPasswordDto): Promise<boolean> {
    return this.userService.changeUserPassword(userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
