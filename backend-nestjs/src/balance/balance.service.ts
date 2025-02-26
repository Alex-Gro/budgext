import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Balance } from '@prisma/client';

@Injectable()
export class BalanceService {
  constructor(private prismaService: PrismaService) {}

  async getUserBalance(userId: number): Promise<Balance> {
    const balance = await this.prismaService.balance.findFirst({
      where: {
        userId
      }
    });
    if (!balance) {
      throw new NotFoundException(`Balance for user with ID ${userId} not found`);
    }
    return balance;
  }

}
