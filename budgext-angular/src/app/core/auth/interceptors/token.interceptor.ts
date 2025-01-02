import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../services/jwt.service';
import { inject } from '@angular/core';

/**
 * Adds an Authorization header with a JWT token if available.
 *
 * @param req - The outgoing HTTP request.
 * @param next - Forwards the request to the next handler.
 * @returns The modified request with the Authorization header.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();
  const request = req.clone({
    setHeaders: {
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
  });
  return next(request);
};
