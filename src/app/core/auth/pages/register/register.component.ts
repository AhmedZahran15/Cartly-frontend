import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '@core/auth/services/auth.service';
import { ValidationError } from '@core/auth/models/error.model';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    MessageModule,
    ToastModule,
    DatePickerModule,
    SelectButtonModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  loading = false;
  errorMessage: string | null = null;
  registerForm: FormGroup;
  serverErrors: { [key: string]: string } = {};
  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  maxDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10,14}$/),
          ],
        ],
        dateOfBirth: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Helper method to check if a field has a server error and return the error message
  getServerError(fieldName: string): string | null {
    return this.serverErrors[fieldName] || null;
  }

  // Helper method to handle backend validation errors
  private handleBackendErrors(errors: ValidationError[]): void {
    this.serverErrors = {};

    errors.forEach((error) => {
      const fieldName = error.field;
      const errorMessage = error.message;

      // Store error message
      this.serverErrors[fieldName] = errorMessage;

      // Mark the field as invalid with a custom error
      const control = this.registerForm.get(fieldName);
      if (control) {
        // Force field to be marked as touched and dirty to show validation
        control.markAsTouched();
        control.markAsDirty();

        // Set the error
        control.setErrors({ serverError: true });
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    const hasPassword = !!password;
    const hasConfirmPassword = !!confirmPassword;

    if (hasPassword && hasConfirmPassword) {
      const passwordsMatch = password!.value === confirmPassword!.value;
      if (!passwordsMatch) {
        return { passwordMismatch: true };
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    this.serverErrors = {}; // Clear any previous server errors

    const userData = {
      firstName: this.registerForm.value.firstName as string,
      lastName: this.registerForm.value.lastName as string,
      email: this.registerForm.value.email as string,
      phone: this.registerForm.value.phone as string,
      dateOfBirth: this.registerForm.value.dateOfBirth as Date,
      gender: this.registerForm.value.gender as string,
      password: this.registerForm.value.password as string,
      confirmPassword: this.registerForm.value.confirmPassword as string,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'Please check your email to verify your account.',
            life: 7000,
          });

          // Navigate to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        }
      },
      error: (error: any) => {
        this.loading = false;

        // Standard error object with structured backend validation
        const errorObj = error.error || error;

        // Handle validation errors if they exist in the response
        if (errorObj.errors && Array.isArray(errorObj.errors)) {
          this.handleBackendErrors(errorObj.errors);
        }

        // Show appropriate error message
        const errorMsg =
          errorObj.message || 'Registration failed. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: errorMsg,
          life: 5000,
        });
      },
    });
  }
}
