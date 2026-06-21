import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class AuthService {

  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private api: ApiService, private router: Router) {
    const saved = localStorage.getItem('rental_user');
    if (saved) {
      const user: User = JSON.parse(saved);
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string): Observable<User[]> {
    return this.api.post<{ token: string, user: User }>('/auth/login', { email, password }).pipe(
      tap(res => {
        this.currentUser.set(res.user);
        this.isLoggedIn.set(true);
        localStorage.setItem('rental_token', res.token);
        localStorage.setItem('rental_user', JSON.stringify(res.user));
      }),
      map(res => [res.user]),
      catchError(() => { return of([]) })
    );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.api.post<{ token: string, user: User }>('/auth/register', userData).pipe(
      tap(response => {
        this.currentUser.set(response.user);
        this.isLoggedIn.set(true);
        localStorage.setItem('rental_token', response.token);
        localStorage.setItem('rental_user', JSON.stringify(response.user));
      }),
      map(response => response.user)
    );
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('rental_token');
    localStorage.removeItem('rental_user');
    this.router.navigate(['/auth/login']);
  }


  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.currentUser()?.role === 'customer';
  }
}
