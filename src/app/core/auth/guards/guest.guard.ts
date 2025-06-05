import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformServer } from '@angular/common';

/**
 * Angular 19 route guard function that allows only guest (non-authenticated) users to access routes.
 * Redirects already logged-in users to the home/dashboard page.
 *
 * @returns true if the user is a guest (NOT authenticated), otherwise redirects to home page and returns false
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const PLATFORM = inject(PLATFORM_ID);

  if (isPlatformServer(PLATFORM)) {
    return false;
  }
  // Force a check of the authentication status from localStorage
  // This ensures we're getting the latest state on each route navigation
  if (!authService.checkIsAuthenticated()) {
    return true;
  }

  // If user is authenticated, immediately redirect to home page
  // before any component is rendered
  router.navigate(['/home'], { skipLocationChange: false });
  return false;
};

// Export the same guard with an alternative name for backward compatibility
export const nonAuthGuard = guestGuard;
