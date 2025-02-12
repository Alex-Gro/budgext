import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/auth/interceptors/token.interceptor';
import { JwtService } from './core/auth/services/jwt.service';
import { UserService } from './core/auth/services/user.service';
import { EMPTY } from 'rxjs';
import { errorInterceptor } from './core/auth/interceptors/error.interceptor';
import { apiInterceptor } from './core/auth/interceptors/api.interceptor';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

export function initAuth(jwtService: JwtService, userService: UserService) {
  return jwtService.getToken() ? userService.getCurrentUser() : EMPTY;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideLuxonDateAdapter(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor, errorInterceptor, apiInterceptor])
    ),
    provideAppInitializer(() => initAuth(inject(JwtService), inject(UserService))),
  ],
};
