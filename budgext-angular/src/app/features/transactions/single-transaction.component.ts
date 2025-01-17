import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { TransactionService } from './services/transaction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';
import { Transaction, TransactionFormGroup } from './models/transaction.model';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../../core/auth/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-single-transaction',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatButton,
  ],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss'
})
export class SingleTransactionComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  public isNewTransaction: boolean = false;

  private _transaction: Transaction | null = null;
  private _userId: number | null = null;

  public formGroup: FormGroup<TransactionFormGroup> | null = null;

  public creating: boolean = false;

  constructor(private transactionService: TransactionService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {}


  ngOnInit(): void {
    // TODO If !userId then redirect to login or dont do the rest of ngOnInit() ?
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe), map((user) => user?.id))
    .subscribe((userId) => this._userId = userId || null);

    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.creating = true;
      this.isNewTransaction = true;
      this._transaction = null;
      this.formGroup = this.createFormGroup({
        id: null,
        amount: 0,
        type: 'expense',
        title: '',
        description: '',
        date: new Date(),
        updatedAt: new Date(),
        userId: this._userId,
      } as Transaction);

    } else if (id && !isNaN(parseInt(id, 10))) {
      this.creating = false;
      this.transactionService.transactions$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((transactions) => {
        if (transactions) {
          this._transaction = transactions.find((transaction: Transaction) => transaction.id === parseInt(id, 10)) || null;
          if (this._transaction) {
            this.isNewTransaction = false;
            this.formGroup = this.createFormGroup(this._transaction);
          }
        }
      });
    }
  }

  createFormGroup(transaction: Transaction): FormGroup<TransactionFormGroup> {
    return new FormGroup<TransactionFormGroup>({
      id: new FormControl<number | null>(transaction?.id || null),
      amount: new FormControl<number>(transaction?.amount || 0, {validators: [Validators.required], nonNullable: true}),
      type: new FormControl<string>(transaction?.type || 'expense', {validators: [Validators.required], nonNullable: true}),
      title: new FormControl<string>(transaction?.title || '', {validators: [Validators.required], nonNullable: true}),
      description: new FormControl<string>(transaction?.description || '', {nonNullable: true}),
      date: new FormControl<Date>(transaction?.date || new Date(), {validators: [Validators.required], nonNullable: true}),
      updatedAt: new FormControl<Date>(transaction?.updatedAt || new Date(), {validators: [Validators.required], nonNullable: true}),
      userId: new FormControl<number>(transaction?.userId, {validators: [Validators.required], nonNullable: true}),
    });
  }

  createTransaction() {
    if (this.formGroup) {
      this.transactionService.createTransaction(this.formGroup.value as Transaction).subscribe({
        next: () => {
          console.log('Transaction created');
          this.router.navigate(['/user/transactions']);
        },
        error: (err) => {
          console.error('Error creating transaction', err);
        }
      });
    }
  }

  updateTransaction() {
    if (this.formGroup && this._transaction?.id) {
      this.transactionService.updateTransaction(this._transaction.id, this.formGroup.value as Transaction).subscribe({
        next: () => {
          console.log('Transaction updated');
          this.router.navigate(['/user/transactions']);
        },
        error: (err) => {
          console.error('Error updating transaction', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
