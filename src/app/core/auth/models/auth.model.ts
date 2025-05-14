// User registration request payload
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

// Login request payload
export interface LoginRequest {
  email: string;
  password: string;
}

// Email verification request payload
export interface VerifyEmailRequest {
  token: string;
}

// Forgot password request payload
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request payload
export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// User update payload
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  // Add other fields as needed
}

// Auth response from API
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// User model
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
}

// Generic API response
export interface ApiResponse<T = any> {
  success: string;
  message: string;
  data?: T;
  user?: T extends User ? User : never;
}
