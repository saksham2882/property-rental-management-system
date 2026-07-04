import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class UserService {

  private api = inject(ApiService);

  getAllUsers(role?: string): Observable<User[]> {
    const url = role ? `/users?role=${role}` : '/users';
    return this.api.get<User[]>(url);
  }

  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`/users/${id}`);
  }

  updateProfile(userId: any, data: Partial<User>): Observable<User> {
    return this.api.patch<User>(`/users/${userId}`, data);
  }

  addToWishlist(userId: any, propertyId: any): Observable<any> {
    return this.api.post(`/users/${userId}/wishlist/${propertyId}`, {});
  }

  removeFromWishlist(userId: any, propertyId: any): Observable<any> {
    return this.api.delete(`/users/${userId}/wishlist/${propertyId}`);
  }
}
