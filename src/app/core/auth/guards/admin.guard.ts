import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Angular 19 route guard function that protects routes for admin only.
 * Uses inject() for dependency injection to access services.
 *
 * @returns true if the user is authenticated and is an admin, otherwise redirects and returns false
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is authenticated
  if (authService.isAuthenticated()) {
    // Then check if user is an admin
    if (authService.isAdmin()) {
      return true;
    } else {
      // User is authenticated but not an admin
      router.navigate(['/forbidden']);
      return false;
    }
  }

  // User is not authenticated at all
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
