import {
  APP_INITIALIZER,
  ApplicationConfig,
  Inject,
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

export function initAuth(jwtService: JwtService, userService: UserService) {
  return EMPTY;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([tokenInterceptor, errorInterceptor])
    ),
    provideAppInitializer(() => initAuth(Inject(JwtService), Inject(UserService))),
  ],
};
