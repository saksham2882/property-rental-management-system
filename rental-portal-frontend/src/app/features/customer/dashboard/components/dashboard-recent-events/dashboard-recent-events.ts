import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { ActivityItem } from '../../services/dashboard-service';

@Component({
  selector: 'dashboard-recent-events',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './dashboard-recent-events.html',
  styleUrl: './dashboard-recent-events.css'
})
export class DashboardRecentEventsComponent {

  @Input() activities: ActivityItem[] = [];
}
