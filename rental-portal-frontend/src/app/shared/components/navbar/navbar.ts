import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, timer } from 'rxjs';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { IconComponent } from '../icon/icon';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';
import { selectCurrentUser, selectIsLoggedIn, selectIsAdmin } from '../../../store/auth/auth.selectors';
import { selectUnreadCount } from '../../../store/notifications/notifications.selectors';
import { logout } from '../../../store/auth/auth.actions';
import { loadNotifications } from '../../../store/notifications/notifications.actions';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent, ClickOutsideDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
  
  private store = inject(Store);
  private destroy$ = new Subject<void>();

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

  ngOnInit(): void {
    timer(0, 60000)
      .pipe(
        switchMap(() => this.currentUser$.pipe(take(1))),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        if (user) {
          this.store.dispatch(loadNotifications({ userId: user.id }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.classList.remove('no-scroll');
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.updateBodyScroll();
  }

  toggleUserDropdown(): void { 
    this.userDropdownOpen = !this.userDropdownOpen; 
  }

  closeDropdowns(): void {
    this.userDropdownOpen = false;
    this.mobileMenuOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll(): void {
    if (this.mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } 
    else {
      document.body.classList.remove('no-scroll');
    }
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
