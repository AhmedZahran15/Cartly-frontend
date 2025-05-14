import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'Login - Cartly',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    title: 'Create Account - Cartly',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        '../auth/pages/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
    title: 'Forgot Password - Cartly',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import(
        '../auth/pages/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
    title: 'Reset Password - Cartly',
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import(
        '../auth/pages/verify-email/verify-email.component'
      ).then((m) => m.VerifyEmailComponent),
    title: 'Verify Email - Cartly',
  },
];
