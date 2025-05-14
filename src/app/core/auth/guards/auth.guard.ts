import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Angular 19 route guard function that protects routes from unauthorized access.
 * Uses inject() for dependency injection to access services.
 *
 * @returns true if the user is authenticated, otherwise redirects to login page and returns false
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated using the AuthService
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page with return URL
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
