import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // TODO Maybe implement if toke is expired?
  // TODO Create /services/auth.service.ts and make a checkLogin() for the complete checkup?
  if (authService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
