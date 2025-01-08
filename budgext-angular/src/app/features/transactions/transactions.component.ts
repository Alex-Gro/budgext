import { Component, OnInit } from '@angular/core';
import { TransactionService } from './services/transaction.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-transactions',
  imports: [
    MatButton,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  constructor(private transactionService: TransactionService) {
    this.transactionService.getTransactions().subscribe((res) => console.log(res));
  }

  ngOnInit(): void {
  }

  getTrans() {
    this.transactionService.getTransactions();
  }
}
