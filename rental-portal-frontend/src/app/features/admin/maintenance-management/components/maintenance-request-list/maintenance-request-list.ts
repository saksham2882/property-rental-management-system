import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequest } from '../../../../../core/models/maintenance-model';
import { Lease } from '../../../../../core/models/lease-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-maintenance-request-list',
  imports: [CommonModule, IconComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './maintenance-request-list.html',
  styleUrl: './maintenance-request-list.css'
})
export class MaintenanceRequestListComponent {

  @Input() requests: MaintenanceRequest[] = [];
  @Input() tenantsMap = new Map<string, string>();
  @Input() leases: Lease[] = [];
  @Input() selectedTenantId: string | null = null;
  @Input() selectedUrgency: string | null = null;
  @Input() loading = false;

  @Output() resolve = new EventEmitter<MaintenanceRequest>();

  activeTab: 'pending' | 'in_progress' | 'resolved' | 'all' = 'all';


  get filteredRequests(): MaintenanceRequest[] {
    let list = [...this.requests];
    if (this.selectedTenantId) {
      list = list.filter(r => r.tenantId === this.selectedTenantId);
    }
    if (this.selectedUrgency) {
      list = list.filter(r => (r.urgency || '').toLowerCase() === this.selectedUrgency!.toLowerCase());
    }
    return list;
  }


  get pendingCount(): number {
    return this.filteredRequests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  }


  get inProgressCount(): number {
    return this.filteredRequests.filter(r => (r.status || '').toLowerCase() === 'in_progress').length;
  }


  get resolvedCount(): number {
    return this.filteredRequests.filter(r => (r.status || '').toLowerCase() === 'resolved').length;
  }


  get displayRequests(): MaintenanceRequest[] {
    let list = [...this.filteredRequests];
    if (this.activeTab !== 'all') {
      list = list.filter(r => (r.status || '').toLowerCase() === this.activeTab.toLowerCase());
    }

    return list.sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      const urgencyA = urgencyOrder[(a.urgency || '').toLowerCase() as keyof typeof urgencyOrder] ?? 1;
      const urgencyB = urgencyOrder[(b.urgency || '').toLowerCase() as keyof typeof urgencyOrder] ?? 1;

      if (urgencyA !== urgencyB) {
        return urgencyA - urgencyB;
      }

      const timeA = new Date(a.raisedAt || 0).getTime();
      const timeB = new Date(b.raisedAt || 0).getTime();
      return timeB - timeA;
    });
  }


  setTab(tab: 'pending' | 'in_progress' | 'resolved' | 'all'): void {
    this.activeTab = tab;
  }


  getTenantName(tenantId: string): string {
    return this.tenantsMap.get(tenantId) || 'Customer Tenant';
  }


  getPropertyTitle(tenantId: string): string {
    const lease = this.leases.find(l => l.tenantId === tenantId && l.status === 'active');
    return lease ? lease.propertyTitle : 'Property Unit';
  }


  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="50" viewBox="0 0 24 24" fill="none" stroke="%23a8a29e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    event.target.style.opacity = '0.6';
  }
}