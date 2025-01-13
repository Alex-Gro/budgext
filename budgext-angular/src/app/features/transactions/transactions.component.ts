import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction} from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { MatMiniFabButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIcon,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    DatePipe,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatMiniFabButton,
    RouterLink,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public currentUser: User | null = null;
  public transactions: Transaction[] = [];
  public displayedColumns: string[] = ['_edit', 'amount', 'title', 'type', 'description', 'date', '_delete'];

  constructor(private transactionService: TransactionService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => this.currentUser = user);
    this.transactionService.transactions$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((transactions) => this.transactions = transactions);
  }

  deleteTransaction(transactionId: number) {
    this.transactionService.deleteTransaction(transactionId).subscribe({
      next: () => {
        console.log('Transaction deleted');
      },
      error: (err) => {
        console.error('Error deleting transaction', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
