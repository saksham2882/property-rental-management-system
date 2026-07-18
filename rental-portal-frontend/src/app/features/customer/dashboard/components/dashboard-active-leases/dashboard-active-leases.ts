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
  private _leases: Lease[] | null = [];

  @Input()
  set leases(val: Lease[] | null) {
    this._leases = val;
  }

  get leases(): Lease[] | null {
    return this._leases;
  }

  get sortedLeases(): Lease[] {
    if (!this._leases) return [];
    return [...this._leases].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.startDate).getTime();
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.startDate).getTime();
      return dateB - dateA;
    });
  }
}