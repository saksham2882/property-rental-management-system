import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { IconComponent } from '../icon/icon';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';
import { selectCurrentUser, selectIsLoggedIn, selectIsAdmin } from '../../../store/auth/auth.selectors';
import { selectUnreadCount } from '../../../store/notifications/notifications.selectors';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  
  private store = inject(Store);

  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  currentUser$ = this.store.select(selectCurrentUser);
  isAdmin$ = this.store.select(selectIsAdmin);
  unreadCount$ = this.store.select(selectUnreadCount);

  mobileMenuOpen = false;
  userDropdownOpen = false;
  isDarkMode = signal(false);

  constructor() {
    const theme = localStorage.getItem('theme') || 'light';
    this.isDarkMode.set(theme === 'dark');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserDropdown(): void { 
    this.userDropdownOpen = !this.userDropdownOpen; 
  }

  closeDropdowns(): void {
    this.userDropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  toggleTheme(): void {
    const next = this.isDarkMode() ? 'light' : 'dark';
    this.isDarkMode.set(!this.isDarkMode());
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  onLogout(): void {
    this.closeDropdowns();
    this.store.dispatch(logout());
  }
}
