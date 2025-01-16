import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction} from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { MatMiniFabButton } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
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
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';

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
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatMiniFabButton,
    RouterLink,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  private _currentUser: User | null = null;
  public transactions: Transaction[] = [];
  public displayedColumns: string[] = ['_edit', 'amount', 'title', 'type', 'description', 'date', '_delete'];
  public filteredTransactions: Transaction[] = [];
  public currentMonth: Date = new Date();
  public selectedMonth: number = this.currentMonth.getMonth();
  public selectedYear: number = this.currentMonth.getFullYear();
  public monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private transactionService: TransactionService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((user) => this._currentUser = user);

    this.transactionService.transactions$.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((transactions) => {
        this.transactions = transactions;
        this.filterTransactionsByMonth();
    });
  }

  filterTransactionsByMonth(): void {
    const month = this.selectedMonth;
    const year = this.selectedYear;
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
  }

  onMonthChange(monthDigit: number): void {
    this.selectedMonth = +monthDigit;
    this.currentMonth.setMonth(this.selectedMonth);
    this.currentMonth = new Date(this.currentMonth); // Reset date to avoid overflow
    this.filterTransactionsByMonth();
  }

  onYearChange(yearDigit: number): void {
    this.selectedYear = +yearDigit;
    this.currentMonth.setFullYear(this.selectedYear);
    this.currentMonth = new Date(this.currentMonth); // Reset date to avoid overflow
    this.filterTransactionsByMonth();
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
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
