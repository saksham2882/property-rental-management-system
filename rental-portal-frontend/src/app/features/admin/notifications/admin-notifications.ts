import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllNotifications, selectNotificationsLoading } from '../../../store/notifications/notifications.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { loadNotifications, markAsRead, createNotification } from '../../../store/notifications/notifications.actions';
import { UserService } from '../../../core/services/user-service';
import { Notification } from '../../../core/models/notification-model';
import { User } from '../../../core/models/user-model';
import { ToastService } from '../../../core/services/toast-service';
import { NotificationBroadcastFormComponent } from './components/notification-broadcast-form/notification-broadcast-form';
import { NotificationHistoryListComponent } from './components/notification-history-list/notification-history-list';


@Component({
  selector: 'app-admin-notifications',
  imports: [ CommonModule, NotificationBroadcastFormComponent, NotificationHistoryListComponent ],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  notifications$ = this.store.select(selectAllNotifications);
  loading$ = this.store.select(selectNotificationsLoading);
  currentUser$ = this.store.select(selectCurrentUser);

  currentUserId = '';
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  tenants: User[] = [];
  tenantsMap = new Map<string, string>();


  broadcastForm: FormGroup = this.fb.group({
    targetUser: ['all', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(5)]],
    type: ['info', Validators.required]
  });

  searchTerm = '';
  filterType: 'all' | 'success' | 'warning' | 'info' | 'error' = 'all';
  filterRead: 'all' | 'unread' | 'read' = 'all';


  ngOnInit(): void {
    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.currentUserId = user.id;
          this.store.dispatch(loadNotifications({ userId: user.id }));
        } 
        else {
          this.store.dispatch(loadNotifications({}));
        }
      });

    this.userService.getAllUsers('customer')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.tenants = users;
          users.forEach(u => this.tenantsMap.set(u.id, u.name));
          this.cdr.markForCheck();
        },
        error: () => {
          this.toastService.error('Failed to load tenants list');
        }
      });

    this.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.notifications = [...list].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        this.applyFilters();
        this.cdr.markForCheck();
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getTenantName(userId: string): string {
    if (!userId) return 'System / Guest';
    return this.tenantsMap.get(userId) || `Tenant (${userId})`;
  }


  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.applyFilters();
  }


  onTypeFilterChange(type: any): void {
    this.filterType = type;
    this.applyFilters();
  }


  onReadFilterChange(status: any): void {
    this.filterRead = status;
    this.applyFilters();
  }


  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(item => {
      const matchesSearch = !this.searchTerm ||
        (item.title && item.title.toLowerCase().includes(this.searchTerm)) ||
        (item.message && item.message.toLowerCase().includes(this.searchTerm)) ||
        (item.userId && this.getTenantName(item.userId).toLowerCase().includes(this.searchTerm));

      const matchesType = this.filterType === 'all' || item.type === this.filterType;

      const matchesRead = this.filterRead === 'all' ||
        (this.filterRead === 'read' && item.isRead) ||
        (this.filterRead === 'unread' && !item.isRead);

      return matchesSearch && matchesType && matchesRead;
    });
  }


  onMarkRead(id: string): void {
    this.store.dispatch(markAsRead({ id }));
    this.toastService.success('Notification marked as read');
  }


  submitBroadcast(): void {
    if (this.broadcastForm.invalid) {
      this.broadcastForm.markAllAsTouched();
      return;
    }
    const { targetUser, title, message, type } = this.broadcastForm.value;

    if (targetUser === 'all') {
      if (this.tenants.length === 0) {
        this.toastService.error('No tenants registered to broadcast notifications.');
        return;
      }

      this.tenants.forEach(tenant => {
        this.store.dispatch(createNotification({
          notification: { userId: tenant.id, title, message, type, isRead: false }
        }));
      });

      this.toastService.success(`Broadcasted notification to all ${this.tenants.length} tenants`);
    } 
    else {
      this.store.dispatch(createNotification({
        notification: { userId: targetUser, title, message, type, isRead: false }
      }));

      this.toastService.success(`Notification sent to ${this.getTenantName(targetUser)}`);
    }

    this.broadcastForm.reset({
      targetUser: 'all',
      title: '',
      message: '',
      type: 'info'
    });
  }
}
