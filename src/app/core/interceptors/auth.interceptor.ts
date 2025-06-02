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

  const publicEndpoints = [
    // User/Auth endpoints
    { path: '/api/users/login', method: 'POST' },
    { path: '/api/users/register', method: 'POST' },
    { path: '/api/users/verify-email', method: 'POST' },
    { path: '/api/users/forgot-password', method: 'POST' },
    { path: '/api/users/reset-password', method: 'POST' },
    // Product endpoints
    { path: '/api/products', method: 'GET' },
    { path: '/api/products/featured', method: 'GET' },
    // Product by ID pattern
    { path: '/api/products/', method: 'GET' }, // This will match /api/products/:id pattern
    // Categories
    { path: '/api/categories', method: 'GET' },
    // Brand endpoints
    { path: '/api/brands', method: 'GET' },
    { path: '/api/brands/', method: 'GET' }, // This will match /api/brands/:id pattern
    // Product Type endpoints
    { path: '/api/producttypes', method: 'GET' },
    { path: '/api/producttypes/', method: 'GET' }, // This will match /api/producttypes/:id pattern
    // Other public endpoints
    { path: '/api/search', method: 'GET' },
  ];

  // Check if the request is for a public endpoint by matching both path and method
  const isPublicEndpoint = publicEndpoints.some(
    (endpoint) =>
      req.url.includes(endpoint.path) &&
      (!endpoint.method || req.method === endpoint.method)
  );

  // Skip authentication checks for public endpoints
  if (isPublicEndpoint) {
    // For public endpoints, we'll still attach the token if available
    // This helps with personalized content like "Recently viewed" or user-specific pricing
    const availableToken = authService.getToken();
    if (availableToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${availableToken}`,
        },
      });
      return next(authReq);
    }
    return next(req);
  }

  // From this point forward, we're dealing with protected endpoints
  const currentToken = authService.getToken();

  // Handle refresh token requests - we don't need special handling here
  // The refreshToken method in AuthService will handle this with proper headers

  // If no token and endpoint requires auth, proceed without token
  // The backend will handle the 401 response
  if (!currentToken) {
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

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${currentToken}`,
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
};
