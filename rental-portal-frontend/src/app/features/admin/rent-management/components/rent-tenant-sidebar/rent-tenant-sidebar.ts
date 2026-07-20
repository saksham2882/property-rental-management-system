import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { Rent } from '../../../../../core/models/rent-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-rent-tenant-sidebar',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './rent-tenant-sidebar.html',
  styleUrl: './rent-tenant-sidebar.css'
})
export class RentTenantSidebarComponent {

  @Input() tenants: User[] = [];
  @Input() leases: Lease[] = [];
  @Input() rents: Rent[] = [];
  @Input() selectedTenant: User | null = null;
  @Input() selectedLeaseId: string | null = null;

  @Output() selectTenant = new EventEmitter<User>();
  @Output() clearTenant = new EventEmitter<void>();
  @Output() selectLease = new EventEmitter<string | null>();


  getTenantPaymentStatus(tenantId: string): 'overdue' | 'pending' | 'paid' | 'no-lease' {
    const tenantLeases = this.leases.filter(l => l.tenantId === tenantId);
    if (tenantLeases.length === 0) return 'no-lease';

    let hasPending = false;
    for (const lease of tenantLeases) {
      const st = this.getLeasePaymentStatus(lease.id);
      if (st === 'overdue') return 'overdue';
      if (st === 'pending') hasPending = true;
    }
    return hasPending ? 'pending' : 'paid';
  }


  get sortedTenants(): User[] {
    const statusPriority = { overdue: 0, pending: 1, paid: 2 };
    
    const activeTenants = this.tenants.filter(t => {
      const activeLease = this.getActiveLease(t.id);
      return !!activeLease;
    });

    return activeTenants.sort((a, b) => {
      const statusA = statusPriority[this.getTenantPaymentStatus(a.id) as keyof typeof statusPriority] ?? 2;
      const statusB = statusPriority[this.getTenantPaymentStatus(b.id) as keyof typeof statusPriority] ?? 2;

      if (statusA !== statusB) {
        return statusA - statusB;
      }
      return a.name.localeCompare(b.name);
    });
  }


  getActiveLease(tenantId: string): Lease | undefined {
    return this.leases.find(l => l.tenantId === tenantId && l.status === 'active');
  }


  getLeasePaymentStatus(leaseId: string): 'overdue' | 'pending' | 'paid' {
    const leaseRents = this.rents.filter(r => r.leaseId === leaseId);
    if (leaseRents.some(r => r.status === 'overdue')) {
      return 'overdue';
    }
    if (leaseRents.some(r => r.status === 'pending')) {
      return 'pending';
    }
    return 'paid';
  }


  getTenantLeases(tenantId: string): Lease[] {
    return this.leases
      .filter(l => l.tenantId === tenantId)
      .sort((a, b) => {
        const statusOrder = { overdue: 0, pending: 1, paid: 2 };
        const statusA = statusOrder[this.getLeasePaymentStatus(a.id)];
        const statusB = statusOrder[this.getLeasePaymentStatus(b.id)];

        if (statusA !== statusB) {
          return statusA - statusB;
        }

        const timeA = new Date(a.startDate || a.createdAt || 0).getTime();
        const timeB = new Date(b.startDate || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }


  onSelect(tenant: User): void {
    this.selectTenant.emit(tenant);
  }

  onClear(): void {
    this.clearTenant.emit();
  }

  onLeaseClick(leaseId: string): void {
    if (this.selectedLeaseId === leaseId) {
      this.selectLease.emit(null);
    } 
    else {
      this.selectLease.emit(leaseId);
    }
  }
}