import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { RelativeTimePipe } from '../../../../../shared/pipes/relative-time-pipe';
import { MaintenanceRequest } from '../../../../../core/models/maintenance-model';
import { ICONS } from '../../../../../shared/components/icon/icon-img';

@Component({
  selector: 'app-maintenance-ticket',
  imports: [CommonModule, IconComponent, RelativeTimePipe],
  templateUrl: './maintenance-ticket.html',
  styleUrl: './maintenance-ticket.css'
})
export class MaintenanceTicketComponent {

  @Input({ required: true }) request!: MaintenanceRequest;

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="50" viewBox="0 0 24 24" fill="none" stroke="%23a8a29e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    event.target.style.opacity = '0.6';
  }

  getCategoryIcon(category: string): string {
    switch (category?.toLowerCase()) {
      case 'plumbing': return 'droplet';
      case 'electrical': return 'zap';
      case 'appliance': return 'tool';
      case 'hvac': return 'wind';
      case 'structural': return 'home';
      default: return 'help-circle';
    }
  }
}
