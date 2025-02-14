import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction} from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatInput } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { DateTime } from 'luxon';

export interface TransactionsByDate {
  date: DateTime;
  transactions: Transaction[];
}

export const PICKER_DATE_FORMATS = {
  parse: {
    dateInput: 'MM.yyyy',
  },
  display: {
    dateInput: 'MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'MMMM yyyy',
    monthYearA11yLabel: 'MMMM yyyy',  },
};

@Component({
  selector: 'app-transactions',
  imports: [
    MatFormFieldModule,
    MatNativeDateModule,
    MatIcon,
    MatIconModule,
    MatFormField,
    MatLabel,
    RouterLink,
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
  providers: [
    {provide: PICKER_DATE_FORMATS, useValue: PICKER_DATE_FORMATS}
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

  public currentMonth: DateTime = DateTime.local().startOf('month');

  public selectedMonth: number = this.currentMonth.month - 1; // Luxon months are 1-based
  public selectedYear: number = this.currentMonth.year;

  /** Search term entered by the user */
  public searchTerm: string = '';

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

  onMonthSelected(event: Date, datepicker: MatDatepicker<DateTime>) {
    console.log(DateTime.fromJSDate(event));
/*
    console.log(event.year);
    console.log(event.month);
    this.currentMonth = event;
*/
    datepicker.close();
  }

  onDateChange(event: DateTime | null): void {
    if (event) {
      const normalizedDate = event.startOf('month');
      this.selectedYear = event.year;
      this.selectedMonth = event.month - 1; // Luxon months are 1-based
      this.currentMonth = normalizedDate;
      this.filterTransactionsByDate();
    }
  }

  /**
   * Filters all transactions by month and year
   * @private
   */
  private filterTransactionsByDate(): void {
    const month = this.selectedMonth;
    const year = this.selectedYear;

    this.filteredTransactions = this.transactions.filter(transaction => {
      if (!transaction?.date?.isValid) {
        console.warn('Invalid date for transaction', transaction);
        return false;
      }
      return transaction.date.month === (month + 1) && transaction.date.year === year;
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
      const date = transaction.date.startOf('day');
      const dateKey = date.toISODate()!;
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: date,
          transactions: []
        };
      }
      acc[dateKey].transactions.push(transaction);
      return acc;
    }, {} as { [key: string]: TransactionsByDate });

    const sortedDatesWithTransactions = Object.values(transactionsByDate)
      .sort((a,b) => b.date.toMillis() - a.date.toMillis()); // Use luxon's toMillis()

    this.filteredByDateTransactions = sortedDatesWithTransactions
      .map((dateWithTransactions) => ({
        date: dateWithTransactions.date,
        transactions: dateWithTransactions.transactions.filter((transaction) =>
          transaction.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          transaction.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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
