import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../auth/services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    RippleModule,
    TooltipModule,
    MenuModule,
    SidebarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private _router = inject(Router);
  private _cartService = inject(CartService);
  private _authService = inject(AuthService);
  private _themeService = inject(ThemeService);

  // Use signals for reactive state
  cartVisible = signal(false);
  menuVisible = signal(false);

  // Computed signals for reactive data
  isAuthenticated = this._authService.isAuthenticated;
  currentUser = this._authService.currentUser;
  isDarkMode = this._themeService.isDark;

  profileMenuItems = computed<MenuItem[]>(() => {
    return this.isAuthenticated()
      ? [
          {
            label: 'My Profile',
            icon: 'pi pi-user',
            command: () => this._router.navigate(['/profile']),
          },
          {
            label:
              this.currentUser()?.role === 'admin'
                ? 'Admin Dashboard'
                : 'Dashboard',
            icon: 'pi pi-cog',
            command: () =>
              this._router.navigate(
                this.currentUser()?.role === 'admin' ? ['/admin'] : ['/profile']
              ),
          },
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => this.logout(),
          },
        ]
      : [
          {
            label: 'Sign In',
            icon: 'pi pi-sign-in',
            command: () => this._router.navigate(['/auth/login']),
          },
          {
            label: 'Register',
            icon: 'pi pi-user-plus',
            command: () => this._router.navigate(['/auth/register']),
          },
        ];
  });

  links = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact', path: '/contact' },
  ];

  logout() {
    this._authService.logout();
  }

  toggleTheme() {
    this._themeService.setTheme(!this.isDarkMode());
  }

  getThemeIcon(): string {
    return this.isDarkMode() ? 'pi pi-moon' : 'pi pi-sun';
  }

  navigateToCart() {
    this._router.navigate(['/cart']);
  }

  get cartService() {
    return this._cartService;
  }
}
