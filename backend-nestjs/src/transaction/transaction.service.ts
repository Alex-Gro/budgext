import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, EditTransactionDto } from './dto';
import { Prisma, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService) {}

  getAllTransactions(userId: number): Promise<Transaction[]> {
    try {
      return this.prismaService.transaction.findMany({
        where: {
          userId,
        }
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to retrieve transactions',
        error: 'Database error'
      });
    }
  }

  async getTransactionById(userId: number, transactionId: number): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.findFirst({
      where: {id: transactionId, userId}
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }
    return transaction;
  }

  async createTransaction(userId: number, dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.create({
      data: {
        userId,
        ...dto,
      }
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction could not be created`);
    }
    return transaction;
  }

  async editTransaction(userId: number, transactionId: number, dto: EditTransactionDto): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        id: transactionId,
        userId,
      }
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${transactionId} not found`);
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException('Access to resource denied!');
    }

    try {
      return this.prismaService.transaction.update({
        where: {
          id: transactionId,
          userId,
        },
        data: {
          ...dto
        }
      });
    } catch (error) {
      console.error('Error updating transactions:', error);
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to update transactions',
        error: 'Database error'
      });
    }
  }

  async deleteTransaction(userId: number, transactionId: number): Promise<boolean> {
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
    try {
      this.prismaService.transaction.delete({
        where: {
          id: transactionId,
          userId,
        }
      });
      return true;
    } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
       // Handle not found error
       if (error.code === 'P2025') {
         return false;
       }
     }
     throw new InternalServerErrorException('Transaction deletion failed');
    }
  }

}
