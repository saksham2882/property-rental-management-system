import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { TenantCardComponent } from '../tenant-card/tenant-card';
import { TenantDetailComponent } from '../tenant-detail/tenant-detail';

@Component({
  selector: 'app-tenant-table-list',
  imports: [ CommonModule, LoadingSpinnerComponent, EmptyStateComponent, TenantCardComponent, TenantDetailComponent ],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.css'
})
export class TenantTableListComponent {

  @Input() tenants: User[] = [];
  @Input() leases: Lease[] = [];
  @Input() loading = false;

  selectedTenant: User | null = null;


  get sortedTenants(): User[] {
    return [...this.tenants].sort((a, b) => {
      const activeA = this.getActiveLease(a.id);
      const activeB = this.getActiveLease(b.id);

      if (activeA && activeB) {
        const timeA = new Date(activeA.startDate || activeA.createdAt || 0).getTime();
        const timeB = new Date(activeB.startDate || activeB.createdAt || 0).getTime();
        return timeB - timeA;
      }
      if (activeA && !activeB) return -1;
      if (!activeA && activeB) return 1;

      return a.name.localeCompare(b.name);
    });
  }


  getTenantLeases(tenantId: string): Lease[] {
    return this.leases
      .filter(l => l.tenantId === tenantId)
      .sort((a, b) => {
        const timeA = new Date(a.startDate || a.createdAt || 0).getTime();
        const timeB = new Date(b.startDate || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
  }

  getActiveLease(tenantId: string): Lease | undefined {
    return this.leases.find(l => l.tenantId === tenantId && l.status === 'active');
  }

  selectTenant(tenant: User): void {
    this.selectedTenant = tenant;
  }

  clearSelectedTenant(): void {
    this.selectedTenant = null;
  }
}
