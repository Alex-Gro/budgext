import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';

export interface Transaction {
  id: number | null,
  amount: number,
  type: string, // income || expense
  title: string,
  description: string,
  date: DateTime,
  updatedAt: DateTime,
  userId: number,
}

export interface TransactionFormGroup {
  id: FormControl<number | null>,
  amount: FormControl<number>,
  type: FormControl<string>, // income || expense
  title: FormControl<string>,
  description: FormControl<string>,
  date: FormControl<DateTime>,
  updatedAt: FormControl<DateTime>,
  userId: FormControl<number>,
}

export interface ApiTransaction {
  id: number | null,
  amount: number,
  type: string, // income || expense
  title: string,
  description: string,
  date: string,
  updatedAt: string,
  userId: number,
}
