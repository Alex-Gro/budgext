import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login/login.component').then((c) => c.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./core/auth/signup/signup.component').then((c) => c.SignupComponent)
  },
];
