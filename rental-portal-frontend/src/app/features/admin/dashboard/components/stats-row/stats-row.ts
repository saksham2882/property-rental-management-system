import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

export interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  availableProperties: number;
  totalRevenue: number;
  maintenanceOpen: number;
  activeTenants: number;
  pendingApplications: number;
}

@Component({
  selector: 'app-stats-row',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './stats-row.html',
  styleUrl: './stats-row.css'
})
export class StatsRowComponent {
  
  @Input() stats: DashboardStats = {
    totalProperties: 0,
    occupiedProperties: 0,
    availableProperties: 0,
    totalRevenue: 0,
    maintenanceOpen: 0,
    activeTenants: 0,
    pendingApplications: 0
  };
}
