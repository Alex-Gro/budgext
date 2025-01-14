import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';

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
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: (transactions) => {
          this.transactionsSubject.next(transactions);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading transactions', err);
          this.loading = false;
        }
      });
    }
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('/transactions').pipe(
      shareReplay(1), // Shares the last response with all subscriptions
    );
  }

  createTransaction(newTransaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>('/transactions', newTransaction).pipe(
      shareReplay(1),
      tap((createdTransaction) => {
        if (createdTransaction && createdTransaction.id) {
          const updatedTransactions = [...this.transactionsSubject.value, createdTransaction];
          this.transactionsSubject.next(updatedTransactions);
        } else {
          console.error('Transaction creation failed', createdTransaction);
        }
      })
    );
  }

  updateTransaction(transactionId: number, updatedTransaction: Transaction): Observable<Transaction> {
    return this.http.patch<Transaction>(`/transactions/${transactionId}`, updatedTransaction).pipe(
      shareReplay(1),
      tap((updatedTransaction) => {
        if (updatedTransaction && updatedTransaction.id) {
          const updatedTransactions = this.transactionsSubject.value.map((transaction) =>
            transaction.id === updatedTransaction.id ? updatedTransaction : transaction
          );
          this.transactionsSubject.next(updatedTransactions);
        } else {
          console.error('Transaction update failed', updatedTransaction);
        }
      })
    );
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`/transactions/${transactionId}`).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => {
        const updatedTransactions = this.transactionsSubject.value.filter(transaction => transaction.id !== transactionId);
        this.transactionsSubject.next(updatedTransactions);
      })
    );
  }

  purgeTransactions(): void {
    this.transactionsSubject.next([]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
