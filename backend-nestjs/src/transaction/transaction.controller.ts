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

@UseGuards(JwtGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  getAllTransactions(@GetUser('id') userId: number) {
    return this.transactionService.getAllTransactions(userId);
  }

  @Get(':id')
  getTransactionById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number) {
    return this.transactionService.getTransactionById(userId, transactionId);
  }

  @Post()
  createTransaction(@GetUser('id') userId: number, @Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(userId, dto);
  }

  @Patch(':id')
  editTransaction(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number, @Body() dto: EditTransactionDto) {
    return this.transactionService.editTransaction(userId, transactionId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTransaction(@GetUser('id') userId: number, @Param('id', ParseIntPipe) transactionId: number) {
    return this.transactionService.deleteTransaction(userId, transactionId);
  }
}
