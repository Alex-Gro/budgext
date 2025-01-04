import { Component, DestroyRef, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

export interface loginFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public destroyRef = inject(DestroyRef);
  public loginForm: FormGroup<loginFormGroup>;

  constructor(private userService: UserService,
              private router: Router) {
    this.loginForm = new FormGroup<loginFormGroup>({
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
    });
  }

  /**
   * POST request for logging in a user
   */
  login() {
    // TODO Typing to User / Credentials?!
    if (this.loginForm && this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      if (email && password) {
        let observable = this.userService.login(email, password);
        observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => void this.router.navigate(['/dashboard/']),
          error: (err: any) => {
            // TODO Handle error in GUI?
            console.log('####');
            console.log(err);
            console.log('####');
          },
        });
      }
    }
  }
}
