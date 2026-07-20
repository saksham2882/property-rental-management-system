import { IconComponent } from '../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectMyNotifications, selectNotificationsLoading } from '../../../store/notifications/notifications.selectors';
import { loadNotifications, markAsRead } from '../../../store/notifications/notifications.actions';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time-pipe';
import { Notification } from '../../../core/models/notification-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, IconComponent, RelativeTimePipe, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private destroy$ = new Subject<void>();

  notifications$ = this.store.select(selectMyNotifications);
  loading$ = this.store.select(selectNotificationsLoading);
  currentUser$ = this.store.select(selectCurrentUser);

  userId = '';
  myNotifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  searchQuery = '';
  activeTab = 'all';


  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.store.dispatch(loadNotifications({ userId: user.id }));
      }
    });

    this.notifications$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.myNotifications = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.applyFilters();
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onMarkRead(id: string): void {
    this.store.dispatch(markAsRead({ id }));
  }


  onMarkAllRead(): void {
    const unread = this.myNotifications.filter(n => !n.isRead);
    unread.forEach(n => {
      if (n.id) {
        this.store.dispatch(markAsRead({ id: n.id }));
      }
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.applyFilters();
  }


  applyFilters(): void {
    this.filteredNotifications = this.myNotifications.filter(n => {
      const matchesSearch = !this.searchQuery ||
        (n.title && n.title.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (n.message && n.message.toLowerCase().includes(this.searchQuery.toLowerCase()));

      let matchesTab = true;
      if (this.activeTab === 'unread') {
        matchesTab = !n.isRead;
      } 
      else if (this.activeTab !== 'all') {
        matchesTab = n.type === this.activeTab;
      }

      return matchesSearch && matchesTab;
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle';
      case 'warning': return 'alert-triangle';
      case 'error': return 'alert-circle';
      default: return 'bell';
    }
  }

  getUnreadCount(): number {
    return this.myNotifications.filter(n => !n.isRead).length;
  }
}
