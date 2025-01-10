import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction, TransactionFormGroup } from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-transactions',
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatNativeDateModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  currentUser: User | null = null;
  transactions: Transaction[] = [];

  creatingFormGroup: FormGroup<TransactionFormGroup> | null = null;

  constructor(private transactionService: TransactionService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => this.currentUser = user);
    if (this.currentUser) {
      this.creatingFormGroup = new FormGroup<TransactionFormGroup>({
        id: new FormControl<number | null>(null),
        amount: new FormControl<number>(1, {nonNullable: true}),
        type: new FormControl<string>('income', {nonNullable: true}),
        title: new FormControl<string | null>(''),
        description: new FormControl<string>(''),
        date: new FormControl<Date>(new Date(), {nonNullable: true}),
        updatedAt: new FormControl<Date>(new Date(), {nonNullable: true}),
        userId: new FormControl<number>(this.currentUser.id, {nonNullable: true}),
      });
    }

    console.log(this.currentUser);
    console.log(this.creatingFormGroup);

    this.transactionService.transactions$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((transactions) => this.transactions = transactions);
    console.log(this.transactions);
  }

  createTransaction() {
    if (this.creatingFormGroup) {
      this.transactionService.createTransaction(this.creatingFormGroup).subscribe();
    }
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
