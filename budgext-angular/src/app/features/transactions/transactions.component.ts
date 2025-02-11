import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction} from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { MatMiniFabButton } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';

export interface TransactionsByDate {
  date: Date;
  transactions: Transaction[];
}

@Component({
  selector: 'app-transactions',
  imports: [
    MatFormFieldModule,
    MatNativeDateModule,
    MatIcon,
    MatIconModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    DatePipe,
    MatColumnDef,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatMiniFabButton,
    RouterLink,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    MatCellDef,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardTitle,
    MatList,
    MatListItem,
    MatInput,
    FormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    ReactiveFormsModule,
    MatDatepickerInput,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  private _currentUser: User | null = null;
  /** All available transactions for this user */
  public transactions: Transaction[] = [];
  /** All available transactions for this user in defined period of time (month, year) */
  public filteredTransactions: Transaction[] = [];
  /** All available transactions from {@link filteredTransactions} filtered with current {@link searchTerm} */
  public filteredByDateTransactions: TransactionsByDate[] = [];

  public displayedColumns: string[] = ['_edit', 'amount', 'title', 'description', 'date', '_delete'];

  public currentMonth: Date = new Date();

  public selectedMonth: number = this.currentMonth.getMonth();
  public selectedYear: number = this.currentMonth.getFullYear();
  public monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /** Search term entered by the user */
  public searchTerm: string = '';

  // TODO Testing date variable
  date = new FormControl<Date>(new Date());

  constructor(private transactionService: TransactionService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((user) => this._currentUser = user);

    this.transactionService.transactions$.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((transactions) => {
        this.transactions = transactions;
        this.filterTransactionsByDate();
    });
  }

  // TODO Testing
  setMonthAndYear(event: any, dp: any) {
    console.log(event);
    console.log(dp);
  }

  /**
   * Filters all transactions by month and year
   * @private
   */
  private filterTransactionsByDate(): void {
    const month = this.selectedMonth;
    const year = this.selectedYear;
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
    });
    this.updateFilteredGroups();
  }

  /**
   * Groups transactions by date using reduce and filters them with the current {@link searchTerm} (default = '')
   * @internal
   * @private
   */
  private updateFilteredGroups(): void {
    const transactionsByDate = this.filteredTransactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      // Create date key without time components
      const dateKey = new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth(),
        transactionDate.getDate()
      ).toISOString();

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: new Date(dateKey),
          transactions: []
        };
      }
      acc[dateKey].transactions.push(transaction);
      return acc;
    }, {} as { [key: string]: TransactionsByDate });

    const sortedDatesWithTransactions = Object.values(transactionsByDate).sort((a,b) => b.date.getTime() - a.date.getTime());
    this.filteredByDateTransactions = sortedDatesWithTransactions.map((dateWithTransactions) => ({
      date: dateWithTransactions.date,
      transactions: dateWithTransactions.transactions.filter((transaction) =>
        transaction.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(this.searchTerm.toLowerCase())
      )
    })).filter((dateWithTransactions) => dateWithTransactions.transactions.length > 0);
  }

  /**
   * Calls function to use newly input in search bar to apply search term on transactions
   * @UI
   */
  applySearch(): void {
    this.updateFilteredGroups();
  }

  /**
   * Updates transaction filter for chosen month
   * @param monthDigit - Number of the chosen month
   */
  onMonthChange(monthDigit: number): void {
    this.selectedMonth = +monthDigit;
    this.currentMonth.setMonth(this.selectedMonth);
    this.currentMonth = new Date(this.currentMonth); // Reset date to avoid overflow
    this.filterTransactionsByDate();
  }

  /**
   * Updates transaction filter for chosen year
   * @param yearDigit - Number of the chosen year
   */
  onYearChange(yearDigit: number): void {
    this.selectedYear = +yearDigit;
    this.currentMonth.setFullYear(this.selectedYear);
    this.currentMonth = new Date(this.currentMonth); // Reset date to avoid overflow
    this.filterTransactionsByDate();
  }

  /**
   * Call {@link TransactionService} to delete the chosen transaction
   * @param transactionId - Id of the transaction to delete
   */
  deleteTransaction(transactionId: number): void {
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
