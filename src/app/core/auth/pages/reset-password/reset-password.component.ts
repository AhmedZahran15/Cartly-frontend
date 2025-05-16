import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    PasswordModule,
    MessageModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetToken = '';
  loading = false;
  resetSuccess = false;
  errorMessage: string | null = null;
  resetPasswordForm;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    // Move form creation to constructor
    this.resetPasswordForm = this.fb.group(
      {
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

  ngOnInit(): void {
    // Get token from query params
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.resetToken = params['token'];
      } else {
        // No token provided, redirect to forgot password
        this.errorMessage =
          'Invalid or missing reset token. Please request a new reset link.';
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Token',
          detail: this.errorMessage || 'Unknown error',
          life: 5000,
        });

        setTimeout(() => {
          this.router.navigate(['/auth/forgot-password']);
        }, 2000);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid || !this.resetToken) return;

    this.loading = true;
    this.errorMessage = null;

    const resetData = {
      token: this.resetToken,
      password: this.resetPasswordForm.value.password as string,
      confirmPassword: this.resetPasswordForm.value.confirmPassword as string,
    };

    this.authService.resetPassword(resetData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.resetSuccess = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Password Reset Successful',
            detail: 'Your password has been reset successfully.',
            life: 5000,
          });
        } else {
          const errorMsg =
            response.message || 'Failed to reset password. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Reset Failed',
            detail: errorMsg,
            life: 5000,
          });
        }
      },
      error: (error: Error) => {
        this.loading = false;
        const errorMsg =
          error.message || 'Failed to reset password. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Reset Failed',
          detail: errorMsg,
          life: 5000,
        });
      },
    });
  }
}
