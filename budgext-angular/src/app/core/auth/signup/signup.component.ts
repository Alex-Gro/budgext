import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface SigninFormGroup {
  email: FormControl<string>;
  password: FormControl<string>
}

@Component({
  selector: 'app-signup',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatButton,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  public destroyRef = inject(DestroyRef);
  public signinForm: FormGroup<SigninFormGroup>;

  constructor(private userService: UserService,
              private router: Router) {
    this.signinForm = new FormGroup<SigninFormGroup>({
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

  signin() {
    if (this.signinForm && this.signinForm.valid) {
      const email = this.signinForm.get('email')?.value;
      const password = this.signinForm.get('password')?.value;
      if (email && password) {
        let observable = this.userService.signup(email, password);
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
