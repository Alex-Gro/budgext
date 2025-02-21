import { Pipe, PipeTransform } from '@angular/core';
import { TransactionsByDate } from '../../features/transactions/transactions.component';

@Pipe({
  name: 'transactionsSum'
})
export class TransactionsSumPipe implements PipeTransform {
  transform(transactions: TransactionsByDate[]): number {
    return transactions.reduce((total, group) =>
        total + group.transactions.reduce((groupTotal, {type, amount}) =>
            type === 'income' ? groupTotal + amount : groupTotal - amount
          , 0)
      , 0);
  }

}
