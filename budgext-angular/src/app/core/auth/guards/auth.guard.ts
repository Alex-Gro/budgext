import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = sessionStorage.getItem('accessToken');
  const router = inject(Router);
  // TODO Maybe implement if toke is expired?
  // TODO Create /services/auth.service.ts and make a checkLogin() for the complete checkup?
  if (token) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
