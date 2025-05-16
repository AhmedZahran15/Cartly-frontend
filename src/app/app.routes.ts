import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    // This will be your home or dashboard component
    component: AppComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./core/layout/forbidden/forbidden.component').then(
        (m) => m.ForbiddenComponent
      ),
    title: 'Access Denied - Cartly',
  },
  // {
  //   path: '**',
  //   redirectTo: '/auth/login',
  // },
];
