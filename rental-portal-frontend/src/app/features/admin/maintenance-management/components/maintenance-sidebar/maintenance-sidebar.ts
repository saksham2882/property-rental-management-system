import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { MaintenanceRequest } from '../../../../../core/models/maintenance-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-maintenance-sidebar',
  imports: [CommonModule, IconComponent],
  templateUrl: './maintenance-sidebar.html',
  styleUrl: './maintenance-sidebar.css'
})
export class MaintenanceSidebarComponent {

  @Input() tenants: User[] = [];
  @Input() leases: Lease[] = [];
  @Input() requests: MaintenanceRequest[] = [];
  @Input() selectedTenantId: string | null = null;
  @Input() selectedUrgency: string | null = null;

  @Output() selectTenantId = new EventEmitter<string | null>();
  @Output() selectUrgency = new EventEmitter<string | null>();


  get activeTenants(): User[] {
    return this.tenants.filter(t => {
      const hasLease = this.leases.some(l => l.tenantId === t.id);
      const hasRequest = this.requests.some(r => r.tenantId === t.id);
      return hasLease || hasRequest;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }


  getTenantRequestCount(tenantId: string): number {
    return this.requests.filter(r => r.tenantId === tenantId).length;
  }


  getTenantPropertyTitle(tenantId: string): string {
    const lease = this.leases.find(l => l.tenantId === tenantId);
    return lease ? lease.propertyTitle : 'Tenant Customer';
  }


  getHighUrgencyCount(): number {
    return this.requests.filter(r => (r.urgency || '').toLowerCase() === 'high').length;
  }


  getMediumUrgencyCount(): number {
    return this.requests.filter(r => (r.urgency || '').toLowerCase() === 'medium').length;
  }


  getLowUrgencyCount(): number {
    return this.requests.filter(r => (r.urgency || '').toLowerCase() === 'low').length;
  }


  onTenantClick(tenantId: string): void {
    if (this.selectedTenantId === tenantId) {
      this.selectTenantId.emit(null);
    } 
    else {
      this.selectTenantId.emit(tenantId);
    }
  }


  onUrgencyClick(urgency: string | null): void {
    if (this.selectedUrgency === urgency) {
      this.selectUrgency.emit(null);
    } 
    else {
      this.selectUrgency.emit(urgency);
    }
  }
}
