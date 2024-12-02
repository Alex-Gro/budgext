import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Balance } from '@prisma/client';

@Injectable()
export class BalanceService {
  constructor(private prismaService: PrismaService) {}

  getUserBalance(userId: number): Promise<Balance | undefined> {
    return this.prismaService.balance.findFirst({
      where: {
        userId
      }
    });
  }

}
