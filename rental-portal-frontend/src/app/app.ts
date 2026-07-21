import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Navbar } from "./shared/components/navbar/navbar";
import { Footer } from "./shared/components/footer/footer";
import { NgxSonnerToaster } from 'ngx-sonner';
import { LoaderService } from './core/services/loader-service';
import { loadUserFromStorage } from './store/auth/auth.actions';
import { loadNotifications } from './store/notifications/notifications.actions';
import { User } from './core/models/user-model';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, NgxSonnerToaster, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  protected readonly title = signal('RentEase Portal');
  showFooter = signal(true);
  showNavbar = signal(true);

  public readonly loaderService = inject(LoaderService);
  private store = inject(Store);
  private router = inject(Router);

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedUser = localStorage.getItem('rental_user');
    const token = localStorage.getItem('auth-token');
    if (savedUser && token) {
      const user: User = JSON.parse(savedUser);
      this.store.dispatch(loadUserFromStorage({ user, token }));
      this.store.dispatch(loadNotifications({ userId: user.id }));
    }
  }

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const url = event.urlAfterRedirects || event.url;
      const isAuthPage = url.includes('/auth/login') || url.includes('/auth/register');
      this.showFooter.set(!isAuthPage);
      this.showNavbar.set(!isAuthPage);
    });
  }
}
