import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

/**
 * HTTP interceptor for adding authentication tokens to outgoing requests
 * and handling authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Only add auth token to API requests (skip for assets, etc.)
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Skip token checks for auth endpoints to avoid loops
  const authEndpoints = ['/api/users/login', '/api/users/register', '/api/users/refresh-token'];
  if (authEndpoints.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  // Check if token is expired before proceeding
  if (authService.isTokenExpired()) {
    // Token is expired, logout silently and redirect if not already on login page
    authService.logout();
    if (!router.url.includes('/auth/login')) {
      router.navigate(['/auth/login'], {
        queryParams: { expired: 'true' },
      });
    }
    return next(req);
  }

  // Check if token needs refreshing (close to expiration)
  if (authService.shouldRefreshToken()) {
    // Try to refresh token before proceeding with request
    return authService.refreshToken().pipe(
      catchError(() => {
        // If refresh fails, continue with the original token
        return next(req);
      }),
      // After refresh (success or failure), proceed with the request
      switchMap(() => {
        // Get the new token after refresh
        const freshToken = authService.getToken();
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${freshToken}`,
          },
        });
        return next(authReq);
      })
    );
  }

  const token = authService.getToken();

  // Clone the request and add the authorization header if token exists
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Process the request with token and handle any auth errors
    return next(authReq).pipe(
      catchError((error) => {
        // Handle 401 Unauthorized errors
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Token expired or invalid, logout the user
          authService.logout();
          router.navigate(['/auth/login'], {
            queryParams: { unauthorized: 'true' },
          });
        }
        return throwError(() => error);
      })
    );
  }

  // No token available, proceed with the original request
  return next(req);
};
