import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, EditTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  getAllTransactions(userId: number) {
    return this.prismaService.transaction.findMany({
      where: {
        userId,
      }
    });
  }

  getTransactionById(userId: number, transactionId: number) {
    return this.prismaService.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      }
    });
  }

  async createTransaction(userId: number, dto: CreateTransactionDto) {
    const transaction = await this.prismaService.transaction.create({
      data: {
        userId,
        ...dto,
      }
    });
    return transaction;
  }

  async editTransaction(userId: number, transactionId: number, dto: EditTransactionDto) {
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        id: transactionId,
        userId,
      }
    });
    if (!transaction || transaction.userId !== userId) {
      throw new ForbiddenException('Access to resource denied!');
    }
    return this.prismaService.transaction.update({
      where: {
        id: transactionId,
        userId,
      },
      data: {
        ...dto
      }
    });
  }

  async deleteTransaction(userId: number, transactionId: number) {
    // TODO Necessary to check for userId && transactionId or transactionId enough?
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        id: transactionId,
        userId
      }
    });
    if (!transaction || transaction.userId !== userId) {
      throw new ForbiddenException('Access to resource denied!');
    }
    await this.prismaService.transaction.delete({
      where: {
        id: transactionId,
        userId,
      }
    });
  }

}
