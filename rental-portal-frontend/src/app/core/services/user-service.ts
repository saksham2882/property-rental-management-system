import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user-model';
import { ApiService } from '../global/api-service';
import { AuthService } from './auth-service';

@Injectable({ 
  providedIn: 'root' 
})
export class UserService {

  private api = inject(ApiService);
  private authService = inject(AuthService);

  getAllUsers(role?: string): Observable<User[]> {
    const url =  `/users?role=${role}`;
    return this.api.get<User[]>(url);
  }

  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  updateProfile(userId: any, data: Partial<User>): Observable<User> {
    return this.api.patch<User>(`/users/${userId}`, data).pipe(
      tap(updated => {
        this.authService.currentUser.set(updated);
        localStorage.setItem('rental_user', JSON.stringify(updated));
      })
    );
  }

  addToWishlist(propertyId: any): Observable<any> {
    const userId = this.authService.currentUser()?.id;
    return this.api.post(`/users/${userId}/wishlist/${propertyId}`, {}).pipe(
      tap(() => {
        const user = this.authService.currentUser();
        if (user) {
          if (!user.wishlist) user.wishlist = [];
          if (!user.wishlist.includes(propertyId)) {
            user.wishlist.push(propertyId);
          }
          this.authService.currentUser.set({ ...user });
          localStorage.setItem('rental_user', JSON.stringify(user));
        }
      })
    );
  }

  removeFromWishlist(propertyId: any): Observable<any> {
    const userId = this.authService.currentUser()?.id;
    return this.api.delete(`/users/${userId}/wishlist/${propertyId}`).pipe(
      tap(() => {
        const user = this.authService.currentUser();
        if (user && user.wishlist) {
          user.wishlist = user.wishlist.filter(id => id !== propertyId);
          this.authService.currentUser.set({ ...user });
          localStorage.setItem('rental_user', JSON.stringify(user));
        }
      })
    );
  }
}
