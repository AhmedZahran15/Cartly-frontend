import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  ApiResponse,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
} from '../models/auth.model';
import { ApiService } from '../../services/api.service';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);

  // Authentication state using signals
  private readonly isAuthenticatedSignal = signal<boolean>(
    this.checkInitialAuthState()
  );
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // Current user state using signals
  private readonly currentUserSignal = signal<User | null>(
    this.loadStoredUser()
  );
  readonly currentUser = this.currentUserSignal.asReadonly();

  // Keys for local storage
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  private tokenExpirationTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Gets a value from either localStorage or sessionStorage
   * @param key The key to look for in storage
   * @returns The stored value or null if not found
   */
  private getFromStorage(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    // Try localStorage first, then sessionStorage
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  /**
   * Removes a value from both localStorage and sessionStorage
   * @param key The key to remove
   */
  private removeFromStorage(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  /**
   * Checks if the user is initially authenticated by looking for a token in storage
   * and verifying it's not expired
   * @returns boolean indicating if the user is authenticated with a valid token
   */
  private checkInitialAuthState(): boolean {
    // For initial state, use same verification logic but don't update signals
    return this.verifyTokenValidity(false);
  }

  /**
   * Verifies if the token exists and is valid
   * @param updateSignals Whether to update the authentication signals based on verification results
   * @returns boolean indicating if the token is valid
   */
  private verifyTokenValidity(updateSignals: boolean = false): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Not authenticated on server-side
    }

    const token = this.getFromStorage(this.TOKEN_KEY);
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<
        JwtPayload & { userId?: string; role?: string }
      >(token);
      const isExpired = (decodedToken.exp || 0) < Date.now() / 1000;

      // If token is expired, clear it and return false
      if (isExpired) {
        this.removeFromStorage(this.TOKEN_KEY);
        this.removeFromStorage(this.USER_KEY);

        if (updateSignals) {
          this.isAuthenticatedSignal.set(false);
          this.currentUserSignal.set(null);
        }

        return false;
      }

      // If we need to update signals and the token is valid
      if (updateSignals && !this.isAuthenticatedSignal()) {
        this.isAuthenticatedSignal.set(true);
        // Load user if not already loaded
        if (!this.currentUserSignal()) {
          const userData = this.getFromStorage(this.USER_KEY);
          if (userData) {
            this.currentUserSignal.set(JSON.parse(userData));
          }
        }
      }

      return true;
    } catch (error) {
      // If token cannot be decoded, consider it invalid
      this.removeFromStorage(this.TOKEN_KEY);
      this.removeFromStorage(this.USER_KEY);

      if (updateSignals) {
        this.isAuthenticatedSignal.set(false);
        this.currentUserSignal.set(null);
      }

      return false;
    }
  }

  /**
   * Loads the stored user from storage (localStorage or sessionStorage)
   * @returns The user object or null if not found
   */
  private loadStoredUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const userData = this.getFromStorage(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Register a new user
   * @param userData The user registration data
   * @returns Observable with the auth response
   */
  register(userData: RegisterRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('users/register', userData);
  }

  /**
   * Login a user with email and password
   * @param credentials The login credentials
   * @returns Observable with the auth response
   */
  loginWithCredentials(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('users/login', {
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.handleAuthSuccess(response, credentials.rememberMe);
          } else {
            // If server returned success: false, treat it as an error
            throw new Error(response.message || 'Login failed');
          }
        }),
        catchError((error) => {
          return throwError(() => new Error(error.error.message || 'Login failed'));
        })
      );
  }

  /**
   * Set an auto logout timer based on token expiration
   * Will automatically log user out when token expires
   */
  private setAutoLogoutTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clear any existing timer
    this.clearLogoutTimer();

    // Get token expiration date
    const expirationDate = this.getTokenExpirationDate();
    if (!expirationDate) return;

    // Calculate time until expiration in milliseconds
    const expiresIn = expirationDate.getTime() - Date.now();

    // If token is already expired, logout immediately
    if (expiresIn <= 0) {
      this.logout();
      return;
    }

    // Constants
    const BUFFER_TIME = 30000; // 30 seconds buffer for network delays
    const MAX_TIMEOUT = 2147483647; // Max setTimeout value (~24.8 days)

    // Calculate the ideal delay (with buffer for network delays)
    const idealDelay = expiresIn - BUFFER_TIME;

    // Ensure delay is within JavaScript's setTimeout limits and non-negative
    const safeDelay = Math.min(Math.max(0, idealDelay), MAX_TIMEOUT);

    this.tokenExpirationTimer = setTimeout(() => {
      // If we reached the maximum timeout but the token isn't expired yet,
      // we need to set up another timer for the remaining time
      if (idealDelay > MAX_TIMEOUT && !this.isTokenExpired()) {
        // Token still valid, reset the timer for the remaining time
        this.setAutoLogoutTimer();
      } else if (this.isTokenExpired()) {
        // Token is expired, perform logout
        this.logout();
      } else {
        // Edge case: token expiration changed or something unexpected happened
        // Reset the timer to be safe
        this.setAutoLogoutTimer();
      }
    }, safeDelay);
  }

  /**
   * Clear the auto logout timer
   */
  private clearLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /**
   * Handle successful authentication
   * @param response The auth response from API
   * @param rememberMe Whether to persist the session across browser sessions
   */
  private handleAuthSuccess(
    response: AuthResponse,
    rememberMe: boolean = false
  ): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Verify the success field is true
    if (!response.success) {
      console.error(
        'Authentication response indicated failure:',
        response.message
      );
      return;
    }

    const { token, user } = response;

    // Choose storage based on remember me option
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store auth data in the appropriate storage
    storage.setItem(this.TOKEN_KEY, token);
    storage.setItem(this.USER_KEY, JSON.stringify(user));

    // Update signals
    this.isAuthenticatedSignal.set(true);
    this.currentUserSignal.set(user);

    // Set up auto logout timer
    this.setAutoLogoutTimer();

    // Navigate to home page
    this.router.navigate(['/home']);
  }

  /**
   * Verify user email with token
   * @param verifyData The verification token
   * @returns Observable with the response
   */
  verifyEmail(verifyData: VerifyEmailRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('users/verify-email', verifyData);
  }

  /**
   * Request a password reset email
   * @param forgotPasswordData The email for password reset
   * @returns Observable with the response
   */
  forgotPassword(
    forgotPasswordData: ForgotPasswordRequest
  ): Observable<ApiResponse> {
    return this.api.post<ApiResponse>(
      'users/forgot-password',
      forgotPasswordData
    );
  }

  /**
   * Reset password with token
   * @param resetData The reset password data with token
   * @returns Observable with the response
   */
  resetPassword(resetData: ResetPasswordRequest): Observable<ApiResponse> {
    return this.api.post<ApiResponse>('users/reset-password', resetData);
  }

  /**
   * Update user profile
   * @param userId The ID of the user to update
   * @param userData The user data to update
   * @returns Observable with the updated user
   */
  updateUser(
    userId: string,
    userData: UpdateUserRequest
  ): Observable<ApiResponse<User>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    return this.api
      .patch<ApiResponse<User>>(`users/${userId}`, userData, headers)
      .pipe(
        tap((response) => {
          // Check for user field in the response (updated API structure)
          const userData = response.user || response.data;

          if (userData) {
            // Update the stored user data
            const updatedUser = {
              ...this.currentUserSignal(),
              ...userData,
            };
            this.currentUserSignal.set(updatedUser);
            if (isPlatformBrowser(this.platformId)) {
              // Update the user data in the same storage that was used for login
              if (localStorage.getItem(this.TOKEN_KEY)) {
                localStorage.setItem(
                  this.USER_KEY,
                  JSON.stringify(updatedUser)
                );
              }
              if (sessionStorage.getItem(this.TOKEN_KEY)) {
                sessionStorage.setItem(
                  this.USER_KEY,
                  JSON.stringify(updatedUser)
                );
              }
            }
          }
        })
      );
  }

  /**
   * Check if the token is expired
   * @returns boolean indicating if the current token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decodedToken = jwtDecode<
        JwtPayload & { userId?: string; role?: string }
      >(token);

      if (!decodedToken.exp) return true;

      const currentTime = Date.now() / 1000; // Convert to seconds
      return (decodedToken.exp || 0) < currentTime;
    } catch (error) {
      // If there's an error decoding the token, consider it expired
      return true;
    }
  }

  /**
   * Get the expiration time of the token
   * @returns Date object representing the token expiration time or null if no token
   */
  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<
        JwtPayload & { userId?: string; role?: string }
      >(token);
      if (!decodedToken.exp) return null;

      return new Date(decodedToken.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract user ID from the token
   * @returns User ID from the token or null if not found
   */
  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<
        JwtPayload & { userId?: string; role?: string }
      >(token);
      return decodedToken.userId || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Logout function that removes the token and updates the authentication state
   * @param redirectToLogin Whether to redirect to login page (default: true)
   */
  logout(redirectToLogin: boolean = true): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.removeFromStorage(this.TOKEN_KEY);
    this.removeFromStorage(this.USER_KEY);

    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);

    this.clearLogoutTimer();

    if (redirectToLogin) {
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Gets the current authentication token
   * @returns The stored authentication token or null if not authenticated
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.getFromStorage(this.TOKEN_KEY);
  }

  /**
   * Check if the current user is an admin
   * @returns boolean indicating if the user has admin role
   */
  isAdmin(): boolean {
    // First check from the stored user data
    const user = this.currentUser();
    if (user?.role === 'admin') return true;

    // If user data doesn't have role or is not admin, check the token
    // This is useful when the user data might not be fully loaded yet
    try {
      const token = this.getToken();
      if (!token) return false;

      const decodedToken = jwtDecode<
        JwtPayload & { userId?: string; role?: string }
      >(token);
      return decodedToken.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh the authentication token
   * @returns Observable with the new auth response or error
   */
  refreshToken(): Observable<AuthResponse> {
    // Get the current token
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available to refresh'));
    }

    // Create headers with current token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Call refresh token endpoint
    return this.api.post<AuthResponse>('users/refresh-token', {}, headers).pipe(
      tap((response) => {
        if (response.success) {
          // Preserve the same storage (localStorage or sessionStorage) that was used before
          const wasInLocalStorage =
            localStorage.getItem(this.TOKEN_KEY) !== null;
          this.handleAuthSuccess(response, wasInLocalStorage);
        } else {
          // If server returned success: false, treat it as an error
          throw new Error(response.message || 'Token refresh failed');
        }
      }),
      catchError((error) => {
        // If refresh fails, logout the user
        this.logout();
        return throwError(
          () => new Error(error.message || 'Token refresh failed')
        );
      })
    );
  }

  /**
   * Check if token needs refresh (less than 10 minutes to expiration)
   * @returns boolean indicating if token should be refreshed
   */
  shouldRefreshToken(): boolean {
    const expirationDate = this.getTokenExpirationDate();
    if (!expirationDate) return false;

    // Calculate time until expiration in milliseconds
    const expiresIn = expirationDate.getTime() - Date.now();
    // If less than 10 minutes until expiration, we should refresh
    const tenMinutesInMs = 10 * 60 * 1000;

    return expiresIn > 0 && expiresIn < tenMinutesInMs;
  }

  /**
   * Initialize auto logout timer based on stored token
   * Call this method when the application starts to ensure
   * auto logout works even if the app was refreshed
   */
  initAutoLogout(): void {
    if (this.checkIsAuthenticated()) {
      this.setAutoLogoutTimer();
    }
  }

  /**
   * Check if the user is currently authenticated by verifying the token
   * This method performs a fresh check instead of just using the signal value
   * @returns boolean indicating if the user is currently authenticated with a valid token
   */
  checkIsAuthenticated(): boolean {
    // Use the shared token verification logic, but with signal updates enabled
    return this.verifyTokenValidity(true);
  }
}
