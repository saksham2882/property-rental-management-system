import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../../../core/models/notification-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time-pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-notification-history-list',
  imports: [ CommonModule,  IconComponent,  RelativeTimePipe,  LoadingSpinnerComponent,  EmptyStateComponent, DropdownComponent ],
  templateUrl: './notification-history-list.html',
  styleUrl: './notification-history-list.css'
})
export class NotificationHistoryListComponent implements OnChanges {

  @Input() notifications: Notification[] = [];
  @Input() tenantsMap = new Map<string, string>();
  @Input() loading = false;
  @Input() searchTerm = '';
  @Input() filterType = 'all';
  @Input() filterRead = 'all';

  @Output() searchChange = new EventEmitter<Event>();
  @Output() typeFilterChange = new EventEmitter<string>();
  @Output() readFilterChange = new EventEmitter<string>();
  @Output() markRead = new EventEmitter<string>();


  pageSize = 6;
  visibleCount = 6;

  typeOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'info', label: 'Information' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  readOptions = [
    { value: 'all', label: 'All Read' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notifications'] || changes['searchTerm'] || changes['filterType'] || changes['filterRead']) {
      this.visibleCount = this.pageSize;
    }
  }

  get displayedNotifications(): Notification[] {
    return this.notifications.slice(0, this.visibleCount);
  }

  get hasMore(): boolean {
    return this.visibleCount < this.notifications.length;
  }

  showMore(): void {
    this.visibleCount += this.pageSize;
  }

  getTenantName(userId: string): string {
    if (!userId) return 'System / Guest';
    return this.tenantsMap.get(userId) || `Tenant (${userId})`;
  }

  onTypeChange(val: string): void {
    this.visibleCount = this.pageSize;
    this.typeFilterChange.emit(val);
  }

  onReadChange(val: string): void {
    this.visibleCount = this.pageSize;
    this.readFilterChange.emit(val);
  }
}