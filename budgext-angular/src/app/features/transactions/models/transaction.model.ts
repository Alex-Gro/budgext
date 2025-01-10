import { FormControl } from '@angular/forms';

export interface Transaction {
  id: number,
  amount: number,
  type: string, // income || expense
  title?: string | null,
  description?: string | null,
  date: Date,
  updatedAt: Date,
  userId: number
}

export interface TransactionFormGroup {
  id: FormControl<number | null>;
  amount: FormControl<number>;
  type: FormControl<string>;
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  date: FormControl<Date>;
  updatedAt: FormControl<Date>;
  userId: FormControl<number>;
}
