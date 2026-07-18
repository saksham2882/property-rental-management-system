import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';

export interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: string;
  date: Date;
}

@Component({
  selector: 'dashboard-recent-events',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard-recent-events.html',
  styleUrl: './dashboard-recent-events.css'
})
export class DashboardRecentEventsComponent {
  
  @Input() activities: ActivityItem[] = [];
}
