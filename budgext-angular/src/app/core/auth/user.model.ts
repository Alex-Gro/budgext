import { DateTime } from 'luxon';
import { FormControl } from '@angular/forms';

export interface User {
  id: number,
  email: string,
  createdAt: DateTime,
  firstname: string,
  lastname: string,
  displayName: string
}

export interface UserFormGroup {
  id: FormControl<number | null>,
  email: FormControl<string>,
  createdAt: FormControl<DateTime>,
  firstname: FormControl<string>,
  lastname: FormControl<string>,
  displayName: FormControl<string>
}

export interface ApiUser {
  id: number,
  email: string,
  createdAt: string,
  firstname: string,
  lastname: string,
  displayName: string
}
