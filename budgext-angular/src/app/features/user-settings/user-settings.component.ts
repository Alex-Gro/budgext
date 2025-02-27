import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../core/auth/user.model';
import { UserService } from '../../core/auth/services/user.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-user-settings',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatLabel,
    MatError,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  private _me: User | null = null;

  public formGroup: FormGroup | null = null;

  // TODO changing password in separate environment? Step by step GUI?
  public passwordControl: FormControl<string> = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.minLength(3), Validators.required]
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe)).subscribe((user) => this._me = user || null);
    this._me ? this.formGroup = this.createUserFormGroup() : this.formGroup = null;
    this.formGroupChanges();
  }

  createUserFormGroup(): FormGroup | null {
    // TODO Add createdAt as DateTime / updatedAt too?
    if (this._me) {
      return new FormGroup({
        id: new FormControl<number>(this._me.id),
        email: new FormControl<string>(this._me.email, {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
        createdAt: new FormControl<string>(this._me.createdAt),
        firstname: new FormControl<string>(this._me.firstname),
        lastname: new FormControl<string>(this._me.lastname),
        displayName: new FormControl<string>(this._me.displayName),
      });
    } else {
      return null;
    }
  }

  /**
   * Used to check for pristine dirty in the current formGroup
   * @private
   */
  private formGroupChanges(): void {
    if (!this.formGroup || !this._me) {
      console.error('Form or user not found!');
      return;
    }
    if (this.formGroup) {
      type UserKey = keyof User;
      this.formGroup.valueChanges.pipe(
        takeUntil(this._ngUnsubscribe),
      )
      .subscribe((value) => {
        Object.keys(value).forEach((key) => {
          const userKey = key as UserKey;
          if (this._me) {
            if (!this.compareValues(value[userKey], this._me[userKey])) {
              this.formGroup?.get(userKey)?.markAsDirty();
            } else {
              this.formGroup?.get(userKey)?.markAsPristine();
            }
          }
        });
      });
    }
  }

  private compareValues(a: any, b: any): boolean {
    if (a === null || b === null) {
      return a === b;
    }

    if (a instanceof DateTime && b instanceof DateTime) {
      return a.day === b.day && a.month === b.month && a.year === b.year;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((val, index) => this.compareValues(val, b[index]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      return aKeys.length === bKeys.length && aKeys.every((key) => this.compareValues(a[key], b[key]));
    }

    return a.toString() === b.toString();
  }

  updateUserSettings() {
    if (this._me && this.formGroup && this.formGroup.get('id')?.value) {
      this.userService.updateUser(this.formGroup.value as User).subscribe({
        next: () => {
          console.log('User settings updated!');
          // TODO Find another solution instead of manually pristining after every API action?
          this.formGroup?.markAsPristine();
        },
        error: (err: any) => {
          console.error('Error updating user settings', err);
        }
      });
    }
  }

  changeUserPassword(): void {
    // TODO Create succeed message for frontend feedback?
    if (this.passwordControl.valid && this.passwordControl.value.length > 2) {
      this.userService.changeUserPassword(this.passwordControl.value).subscribe({
        next: (success: boolean) => {
          if (success) {
            console.log('User password updated!');
            this.passwordControl.reset();
          } else {
            console.log('User password update failed!');
          }
        },
        error: (err: any) => console.error('Error updating user password', err)
      });
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
