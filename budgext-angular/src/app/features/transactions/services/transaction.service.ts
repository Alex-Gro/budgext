import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged, map,
  Observable,
  of,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { ApiTransaction, Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';

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
      this.getTransactions().subscribe({
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
    return this.http.get<ApiTransaction[]>('/transactions').pipe(
      map((response) => response.map((item: ApiTransaction) => ({
        ...item,
        date: DateTime.fromISO(item.date),
        updatedAt: DateTime.fromISO(item.updatedAt)
      }))),
      shareReplay(1), // Shares the last response with all subscriptions
      catchError((err) => {
        console.error('Error loading transactions', err);
        return of([]);
      }),
    );
  }

  createTransaction(newTransaction: Transaction): Observable<Transaction> {
    // Convert from DateTime (luxon) to ISODate for backend
    const transactionPayload = {
      ...newTransaction,
      date: newTransaction.date.toISODate(),
      updatedAt: newTransaction.updatedAt.toISODate()
    };
    return this.http.post<ApiTransaction>('/transactions', transactionPayload).pipe(
      shareReplay(1),
      map((createdTransaction: ApiTransaction) => ({
        ...createdTransaction,
        date: DateTime.fromISO(createdTransaction.date),
        updatedAt: DateTime.fromISO(createdTransaction.updatedAt)
      })),
      tap((mappedTransaction: Transaction) => {
        if (mappedTransaction && mappedTransaction.id) {
          const updatedTransactions: Transaction[] = [...this.transactionsSubject.value, mappedTransaction];
          this.transactionsSubject.next(updatedTransactions);
        } else {
          console.error('Transaction creation failed', mappedTransaction);
        }
      })
    );
  }

  updateTransaction(transactionId: number, updatedTransaction: Transaction): Observable<Transaction> {
    // Convert from DateTime (luxon) to ISODate for backend
    const transactionPayload = {
      ...updatedTransaction,
      date: updatedTransaction.date.toISODate(),
      updatedAt: updatedTransaction.updatedAt.toISODate()
    };
    return this.http.patch<ApiTransaction>(`/transactions/${transactionId}`, transactionPayload).pipe(
      shareReplay(1),
      map((responseTransaction: ApiTransaction) => ({
        ...responseTransaction,
        date: DateTime.fromISO(responseTransaction.date),
        updatedAt: DateTime.fromISO(responseTransaction.updatedAt)
      })),
      tap((mappedTransaction: Transaction) => {
        if (mappedTransaction && mappedTransaction.id) {
          const currentTransaction = this.transactionsSubject.value;
          const index = currentTransaction.findIndex((transaction) => transaction.id === mappedTransaction.id);
          if (index !== -1) {
            const updatedTransactions = [...currentTransaction];
            updatedTransactions[index] = mappedTransaction;
            this.transactionsSubject.next(updatedTransactions);
          } else {
            console.error('Transaction update failed', mappedTransaction);
          }
        } else {
          console.error('Transaction update failed', mappedTransaction);
        }
      }),
      catchError((err) => {
        console.error('Error loading transactions', err);
        return of({} as Transaction);
      }),
    );
  }

  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`/transactions/${transactionId}`).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => {
        const updatedTransactions = this.transactionsSubject.value.filter(transaction => transaction.id !== transactionId);
        this.transactionsSubject.next(updatedTransactions);
      }),
      catchError((err) => {
        console.error('Error loading transactions', err);
        return of(undefined);
      }),
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
