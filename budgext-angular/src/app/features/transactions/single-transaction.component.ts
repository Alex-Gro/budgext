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
import { Subject } from 'rxjs';
import { Transaction, TransactionFormGroup } from './models/transaction.model';
import { MatNativeDateModule } from '@angular/material/core';

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
  private ngUnsubscribe = new Subject<void>();

  public isNewTransaction = false;
  private transaction: Transaction | null = null;
  public formGroup: FormGroup<TransactionFormGroup> | null = null;

  constructor(private transactionService: TransactionService,
              private route: ActivatedRoute,
              private router: Router) {}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNewTransaction = true;
      this.transaction = null;
      this.formGroup = this.createFormGroup({
        id: null,
        amount: 0,
        type: 'expense',
        title: '',
        description: '',
        date: new Date(),
        updatedAt: new Date(),
        userId: 1
      } as Transaction);

    } else if (id && !isNaN(parseInt(id, 10))) {
      this.transactionService.transactions$.subscribe((transactions) => {
        if (transactions) {
          this.transaction = transactions.find((transaction: Transaction) => transaction.id === parseInt(id, 10)) || null;
          if (this.transaction) {
            this.isNewTransaction = false;
            this.formGroup = this.createFormGroup(this.transaction);
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
      // TODO Check correct userId | get User and take it from there?
      userId: new FormControl<number>(transaction?.userId, {validators: [Validators.required], nonNullable: true}),
    });
  }

  createTransaction() {
    if (this.formGroup) {
      this.transactionService.createTransaction(this.formGroup.value as Transaction).subscribe({
        next: () => {
          console.log('Transaction created');
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Error creating transaction', err);
        }
      });
    }
  }

  // TODO update does not work, does not find transaction 404
  updateTransaction() {
    if (this.formGroup && this.transaction?.id) {
      this.transactionService.updateTransaction(this.transaction.id, this.formGroup.value as Transaction).subscribe({
        next: () => {
          console.log('Transaction updated');
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Error updating transaction', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
