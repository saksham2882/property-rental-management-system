import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification-model';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class NotificationService {

  private apiPath = '/notifications';
  private api = inject(ApiService);

  getByUser(userId: any): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.apiPath}?userId=${userId}`);
  }

  getAll(): Observable<Notification[]> {
    return this.api.get<Notification[]>(this.apiPath);
  }

  markAsRead(id: any): Observable<Notification> {
    return this.api.patch<Notification>(`${this.apiPath}/${id}`, { isRead: true });
  }

  create(notification: Partial<Notification>): Observable<Notification> {
    const payload = {
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    return this.api.post<Notification>(this.apiPath, payload);
  }
}
