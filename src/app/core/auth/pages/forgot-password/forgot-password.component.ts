import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  loading = false;
  submitted = false;
  errorMessage: string | null = null;
  forgotPasswordForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const forgotPasswordData = {
      email: this.forgotPasswordForm.value.email as string,
    };

    this.authService.forgotPassword(forgotPasswordData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.submitted = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Email Sent',
            detail: 'We have sent a password reset link to your email address.',
            life: 5000,
          });
        } else {
          const errorMsg =
            response.message || 'Failed to send reset link. Please try again.';
          this.messageService.add({
            severity: 'error',
            summary: 'Request Failed',
            detail: errorMsg,
            life: 5000,
          });
        }
      },
      error: (error: Error) => {
        this.loading = false;
        const errorMsg =
          error.message || 'Failed to send reset link. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Request Failed',
          detail: errorMsg,
          life: 5000,
        });
      },
    });
  }
}
