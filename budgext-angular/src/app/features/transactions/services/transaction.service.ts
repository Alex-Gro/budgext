import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, shareReplay, tap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable().pipe(distinctUntilChanged());

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<any[]>('/transactions').pipe(
      tap({
        next: (transactions: any[]) => {
          this.transactionsSubject.next(transactions);
        },
        error: (err) => {
          console.error('Error loading transactions: ', err);
        }
      }),
      shareReplay(1), // Shares the last response with all subscriptions
    );
  }

  createTransaction() {

  }

  updateTransaction() {

  }

  deleteTransaction() {

  }
}
