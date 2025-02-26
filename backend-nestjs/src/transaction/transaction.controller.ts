import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GetUser } from '../auth/decorator';
import { CreateTransactionDto, EditTransactionDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { Transaction } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllTransactions(@GetUser('id') userId: number): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getTransactionById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number): Promise<Transaction> {
    return this.transactionService.getTransactionById(userId, transactionId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  createTransaction(@GetUser('id') userId: number, @Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(userId, dto);
  }

  // TODO Maybe empty Patch() and get transactionId from dto?
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  editTransaction(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number, @Body() dto: EditTransactionDto): Promise<Transaction> {
    return this.transactionService.editTransaction(userId, transactionId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTransaction(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number): Promise<boolean> {
    return this.transactionService.deleteTransaction(userId, transactionId);
  }
}
