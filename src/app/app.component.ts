import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './core/auth/services/auth.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    // Initialize authentication state and auto-logout timer on app start
    this.authService.initAutoLogout();
  }
}
