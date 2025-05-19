import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '@core/auth/services/auth.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
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
    CheckboxModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  errorMessage: string | null = null;
  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const credentials = {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
      rememberMe: this.loginForm.value.rememberMe as boolean,
    };

    this.authService.loginWithCredentials(credentials).subscribe({
      next: (response) => {
        this.loading = false;
      },
      error: (error: Error) => {
        this.loading = false;
        const errorMsg = error.message || 'Login failed. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: errorMsg,
          life: 5000,
        });
      },
    });
  }
}
