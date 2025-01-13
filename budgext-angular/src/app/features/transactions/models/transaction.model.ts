import { FormControl } from '@angular/forms';

export interface Transaction {
  id: number | null,
  amount: number,
  type: string, // income || expense
  title: string,
  description: string,
  date: Date,
  updatedAt: Date,
  userId: number,
}

export interface TransactionFormGroup {
  id: FormControl<number | null>,
  amount: FormControl<number>,
  type: FormControl<string>, // income || expense
  title: FormControl<string>,
  description: FormControl<string>,
  date: FormControl<Date>,
  updatedAt: FormControl<Date>,
  userId: FormControl<number>,
}
