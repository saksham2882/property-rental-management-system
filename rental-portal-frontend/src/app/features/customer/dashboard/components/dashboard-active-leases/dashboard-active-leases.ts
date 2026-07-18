import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { Lease } from '../../../../../core/models/lease-model';

@Component({
  selector: 'dashboard-active-leases',
  imports: [CommonModule, RouterLink, PriceFormatPipe, EmptyStateComponent],
  templateUrl: './dashboard-active-leases.html',
  styleUrl: './dashboard-active-leases.css'
})
export class DashboardActiveLeasesComponent {

  @Input() leases: Lease[] | null = [];
}
