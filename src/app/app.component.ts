import { Component, OnInit, inject } from '@angular/core';
import { MainLayoutComponent } from "./core/layout/main-layout/main-layout.component";
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
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
