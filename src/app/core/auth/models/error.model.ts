// Backend validation error interface
export interface ValidationError {
  field: string;
  message: string;
}

// Backend error response interface
export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: ValidationError[];
}
