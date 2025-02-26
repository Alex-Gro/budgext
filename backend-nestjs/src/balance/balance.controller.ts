import { Controller, Get, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Balance } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('balances')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get()
  getUserBalance(@GetUser('id') userId: number): Promise<Balance> {
    return this.balanceService.getUserBalance(userId);
  }
}
