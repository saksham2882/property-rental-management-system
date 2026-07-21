import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rent } from '../../../../../core/models/rent-model';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-rent-list',
  imports: [CommonModule, IconComponent, PriceFormatPipe, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './rent-list.html',
  styleUrl: './rent-list.css'
})
export class RentListComponent {

  @Input() rents: Rent[] = [];
  @Input() tenantsMap = new Map<string, string>();
  @Input() leases: Lease[] = [];
  @Input() selectedTenant: User | null = null;
  @Input() selectedLeaseId: string | null = null;
  @Input() loading = false;

  @Output() addInvoice = new EventEmitter<void>();
  @Output() markPaid = new EventEmitter<string>();
  @Output() clearLeaseFilter = new EventEmitter<void>();

  activeTab: 'pending' | 'paid' | 'all' = 'pending';


  get filteredRents(): Rent[] {
    let list = [...this.rents];
    if (this.selectedTenant) {
      list = list.filter(r => r.tenantId === this.selectedTenant!.id);
    }
    if (this.selectedLeaseId) {
      list = list.filter(r => r.leaseId === this.selectedLeaseId);
    }
    return list;
  }


  get pendingRents(): Rent[] {
    return this.filteredRents
      .filter(r => r.status === 'pending' || r.status === 'overdue')
      .sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        const timeA = new Date(a.dueDate || 0).getTime();
        const timeB = new Date(b.dueDate || 0).getTime();
        return timeA - timeB;
      });
  }


  get paidRents(): Rent[] {
    return this.filteredRents
      .filter(r => r.status === 'paid')
      .sort((a, b) => {
        const timeA = new Date(a.paidDate || a.dueDate || 0).getTime();
        const timeB = new Date(b.paidDate || b.dueDate || 0).getTime();
        return timeB - timeA;
      });
  }


  get displayRents(): Rent[] {
    if (this.activeTab === 'pending') {
      return this.pendingRents;
    }
    if (this.activeTab === 'paid') {
      return this.paidRents;
    }

    return [...this.filteredRents].sort((a, b) => {
      const priority = { overdue: 0, pending: 1, paid: 2 };
      const priorityA = priority[a.status as keyof typeof priority] ?? 2;
      const priorityB = priority[b.status as keyof typeof priority] ?? 2;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const timeA = new Date(a.dueDate || 0).getTime();
      const timeB = new Date(b.dueDate || 0).getTime();
      return timeB - timeA;
    });
  }


  get totalCollected(): number {
    return this.filteredRents
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.amount, 0);
  }


  get totalPending(): number {
    return this.filteredRents
      .filter(r => r.status === 'pending' || r.status === 'overdue')
      .reduce((sum, r) => sum + r.amount, 0);
  }


  get overdueCount(): number {
    return this.filteredRents.filter(r => r.status === 'overdue').length;
  }


  get selectedLeaseTitle(): string {
    if (!this.selectedLeaseId) return '';
    const lease = this.leases.find(l => l.id === this.selectedLeaseId);
    return lease ? lease.propertyTitle : `#${this.selectedLeaseId}`;
  }


  setTab(tab: 'pending' | 'paid' | 'all'): void {
    this.activeTab = tab;
  }

  getTenantName(tenantId: string): string {
    return this.tenantsMap.get(tenantId) || 'Customer';
  }

  getPropertyTitle(leaseId: string): string {
    const lease = this.leases.find(l => l.id === leaseId);
    return lease?.propertyTitle || 'Property Unit';
  }

  onAddClick(): void {
    this.addInvoice.emit();
  }

  onMarkPaidClick(id: string): void {
    this.markPaid.emit(id);
  }

  onClearLease(): void {
    this.clearLeaseFilter.emit();
  }
}
