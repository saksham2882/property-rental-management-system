import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Notification } from '../models/notification-model';
import { ToastService } from './toast-service';
import { ApiService } from '../global/api-service';

@Injectable({ 
  providedIn: 'root' 
})
export class NotificationService {

  private apiPath = '/notifications';
  private api = inject(ApiService);
  private toastService = inject(ToastService);

  unreadCount = signal(0);
  private knownIds = new Set<string>();


  getByUser(userId: any): Observable<Notification[]> {
    return this.api.get<Notification[]>(`${this.apiPath}?userId=${userId}`).pipe(
      tap(notifications => {
        const count = notifications.filter(n => !n.isRead).length;
        this.unreadCount.set(count);

        notifications.forEach(n => {
          if (!n.isRead && n.id && !this.knownIds.has(String(n.id))) {
            if (this.knownIds.size > 0) {
              this.toastService.info(n.message);
            }
            this.knownIds.add(String(n.id));
          }
        });

        if (this.knownIds.size === 0) {
          notifications.forEach(n => {
            if (n.id) this.knownIds.add(String(n.id));
          });
        }
      })
    );
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
