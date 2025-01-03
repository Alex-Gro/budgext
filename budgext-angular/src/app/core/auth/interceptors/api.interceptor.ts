import { HttpInterceptorFn } from '@angular/common/http';


/**
 * Intercepts outgoing HTTP requests to prepend a base URL to the request URL.
 * Modifies the request by appending `http://localhost:4200/api` to the existing URL.
 *
 * @param req - The outgoing HTTP request to be modified.
 * @param next - Forwards the modified request to the next handler.
 * @returns The HTTP event as processed by the next handler.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({url: `http://localhost:4200/api${req.url}`});
  return next(apiReq);
};
