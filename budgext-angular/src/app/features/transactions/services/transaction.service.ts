import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { Transaction, TransactionFormGroup } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TransactionService implements OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable().pipe(distinctUntilChanged());

  private loading = false;

  constructor(private http: HttpClient) {}

  loadTransactions(): void {
    if (!this.loading) {
      this.loading = true;
      this.getTransactions().pipe(
        startWith([]),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (transactions) => {
          this.transactionsSubject.next(transactions);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading transaction', err);
          this.loading = false;
        }
      });
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<any[]>('/transactions').pipe(
      shareReplay(1), // Shares the last response with all subscriptions
    );
  }

  createTransaction(newTransactionForm: FormGroup<TransactionFormGroup>): Observable<Transaction> {
    return this.http.post<Transaction>('/transactions', newTransactionForm.value).pipe(
      shareReplay(1),
    );
  }

  updateTransaction(updatedTransactionForm: FormGroup<TransactionFormGroup>): Observable<Transaction> {
    return this.http.patch<Transaction>('/transactions', updatedTransactionForm.value).pipe(
      shareReplay(1),
    );
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`/transactions/${transactionId}`);
  }

  purgeTransactions(): void {
    this.transactionsSubject.next([]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
