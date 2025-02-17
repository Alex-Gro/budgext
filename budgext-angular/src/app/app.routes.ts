import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { UserLayoutComponent } from './core/layout/user-layout/user-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {path: '', component: HomeComponent},
      {path: 'faq', loadComponent: () => import('./features/faq/faq.component').then((c) => c.FaqComponent)},
      {path: 'contact', loadComponent: () => import('./features/contact/contact.component').then((c) => c.ContactComponent)},
      {path: 'login', loadComponent: () => import('./core/auth/login/login.component').then((c) => c.LoginComponent)},
      {path: 'signup', loadComponent: () => import('./core/auth/signup/signup.component').then((c) => c.SignupComponent)},
    ],
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((c) => c.DashboardComponent),
        canActivate: [authGuard]
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then((c) => c.TransactionsComponent),
        canActivate: [authGuard],
      },
      {
        path: 'transactions/:id',
        loadComponent: () => import('./features/transactions/single-transaction.component').then((c) => c.SingleTransactionComponent),
        canActivate: [authGuard],
      },
      {
        path: 'transactions/new',
        loadComponent: () => import('./features/transactions/single-transaction.component').then((c) => c.SingleTransactionComponent),
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/user-settings/user-settings.component').then((c) => c.UserSettingsComponent),
        canActivate: [authGuard],
      },
      {path: '**', redirectTo: 'dashboard'},
    ],
  },
  {path: '**', redirectTo: ''},
];
