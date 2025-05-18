import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '@app/core/auth/services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink, ButtonModule, MessageModule, ProgressSpinnerModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css',
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;
  verified = false;
  errorMessage: string | null = null;
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;

    if (params['token']) {
      this.verifyEmail(params['token']);
    } else {
      this.verifying = false;
      this.verified = false;
      this.errorMessage =
        'No verification token provided. Please check your email for the verification link.';
    }
  }

  verifyEmail(token: string): void {
    const verifyData = { token };

    this.authService.verifyEmail(verifyData).subscribe({
      next: (response) => {
        this.verifying = false;
        if (response.success) {
          this.verified = true;
        } else {
          this.verified = false;
          this.errorMessage =
            response.message || 'Email verification failed. Please try again.';
        }
      },
      error: (error) => {
        this.verifying = false;
        this.verified = false;
        this.errorMessage =
          error.message || 'Email verification failed. Please try again.';
      },
    });
  }
}
