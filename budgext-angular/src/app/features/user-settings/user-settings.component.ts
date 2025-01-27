import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../core/auth/user.model';
import { UserService } from '../../core/auth/services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.currentUser$.pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((user) => this._me = user || null);
    if (this._me) {
      this.formGroup = this.createUserFormGroup();
    } else {
      this.formGroup = null;
    }
  }

  createUserFormGroup(): FormGroup | null {
    // TODO changing password separate?
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

  updateUserSettings() {
    if (this._me && this.formGroup && this.formGroup.get('id')?.value) {
      this.userService.updateUser(this._me.id, this.formGroup.value as User).subscribe({
        next: () => {
          console.log('User settings updated!');
        },
        error: (err: any) => {
          console.error('Error updating user settings', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
