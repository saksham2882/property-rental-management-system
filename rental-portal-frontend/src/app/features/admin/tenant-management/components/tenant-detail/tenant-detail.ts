import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-tenant-detail',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './tenant-detail.html',
  styleUrl: './tenant-detail.css'
})
export class TenantDetailComponent {

  @Input({ required: true }) tenant!: User;
  @Input() leases: Lease[] = [];

  @Output() back = new EventEmitter<void>();

  expandedContracts = new Set<string>();


  onBackClick(): void {
    this.back.emit();
  }

  toggleContract(leaseId: string): void {
    if (this.expandedContracts.has(leaseId)) {
      this.expandedContracts.delete(leaseId);
    } else {
      this.expandedContracts.add(leaseId);
    }
  }

  isContractExpanded(leaseId: string): boolean {
    return this.expandedContracts.has(leaseId);
  }


  calculateDuration(startDateStr: string, endDateStr: string): string {
    if (!startDateStr || !endDateStr) return '';
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.round(diffDays / 30.4375);

    if (months >= 12) {
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      if (remMonths > 0) {
        return `${years} ${years === 1 ? 'Year' : 'Years'}, ${remMonths} ${remMonths === 1 ? 'Month' : 'Months'}`;
      }
      return `${years} ${years === 1 ? 'Year' : 'Years'}`;
    }
    
    return `${months} ${months === 1 ? 'Month' : 'Months'} (${diffDays} days)`;
  }
}
