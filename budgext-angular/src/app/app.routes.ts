import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/guards/auth.guard';

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
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/transactions.component').then((c) => c.TransactionsComponent),
    canActivate: [authGuard]
  },
];
