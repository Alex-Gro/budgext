import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Intercepts HTTP requests to handle errors globally.
 * Extracts the `error` property from the response and re-throws it for further handling.
 *
 * @param req - The outgoing HTTP request.
 * @param next - Forwards the request to the next handler.
 * @returns The modified error or the HTTP event.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((err) => throwError(() => err.error)));
};
