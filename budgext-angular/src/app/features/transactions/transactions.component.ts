import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { Transaction, TransactionFormGroup } from './models/transaction.model';
import { Subject, takeUntil } from 'rxjs';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/auth/services/user.service';
import { User } from '../../core/auth/user.model';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { MatSelect } from '@angular/material/select';
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
    MatCard,
    MatIcon,
    MatSelect,
    MatOption,
    MatError,
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
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public currentUser: User | null = null;
  public transactions: Transaction[] = [];
  public displayedColumns: string[] = ['amount', 'title', 'type', 'description', 'date', 'delete'];

  public creatingFormGroup: FormGroup<TransactionFormGroup> | null = null;

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
        title: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
        description: new FormControl<string>(''),
        date: new FormControl<Date>(new Date(), {nonNullable: true}),
        updatedAt: new FormControl<Date>(new Date(), {nonNullable: true}),
        userId: new FormControl<number>(this.currentUser.id, {nonNullable: true}),
      });
    }

    this.transactionService.transactions$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((transactions) => this.transactions = transactions);
  }

  createTransaction() {
    if (this.creatingFormGroup) {
      this.transactionService.createTransaction(this.creatingFormGroup.value as Transaction).subscribe();
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
