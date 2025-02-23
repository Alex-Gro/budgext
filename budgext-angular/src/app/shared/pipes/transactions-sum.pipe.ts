import { Pipe, PipeTransform } from '@angular/core';
import { TransactionsByDate } from '../../features/transactions/transactions.component';

@Pipe({
  name: 'transactionsSum'
})
export class TransactionsSumPipe implements PipeTransform {
  transform(transactions: TransactionsByDate[]): number {
    const sum = transactions.reduce((total, group) =>
        total + group.transactions.reduce((groupTotal, {type, amount}) =>
            type === 'income' ? groupTotal + amount : groupTotal - amount
          , 0)
      , 0);
    return isNaN(sum) ? 0.00 : this.roundToCent(sum);
  }

  private roundToCent(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
