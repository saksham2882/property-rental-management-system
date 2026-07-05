import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';
import { ApiService } from '../global/api-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.api.post<{ token: string; user: User }>('/auth/login', { email, password });
  }

  register(userData: Partial<User>): Observable<{ token: string; user: User }> {
    return this.api.post<{ token: string; user: User }>('/auth/register', userData);
  }
}
