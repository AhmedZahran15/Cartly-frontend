import { Component, HostListener , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { CartService } from "../../../core/services/cart.service";

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, ButtonModule, RippleModule, TooltipModule, MenuModule , SidebarModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private _router = inject(Router);
  private _cartService = inject(CartService);

  isScrolled = false;
  isAuthenticated = false;
  cartVisible = false;
  profileMenuItems: MenuItem[] = [];
  cartItems = 0; 

  links = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' }
  ];

  constructor() {
    this.updateProfileMenu();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  updateProfileMenu() {
    this.profileMenuItems = this.isAuthenticated
      ? [
          { label: 'My Profile', icon: 'pi pi-user', command: () => this._router.navigate(['/profile']) },
          { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.logout() }
        ]
      : [
          { label: 'Sign In', icon: 'pi pi-sign-in', command: () => this._router.navigate(['/login']) },
          { label: 'Register', icon: 'pi pi-user-plus', command: () => this._router.navigate(['/register']) }
        ];
  }

  toggleAuth() {
    this.isAuthenticated = !this.isAuthenticated;
    this.updateProfileMenu();
  }

  logout() {
    this.isAuthenticated = false;
    this.updateProfileMenu();
    this._router.navigate(['/']);
  }

  navigateToCart() {
    this._router.navigate(['/cart']);
  }

  get cartService() {
    return this._cartService;
  }

}