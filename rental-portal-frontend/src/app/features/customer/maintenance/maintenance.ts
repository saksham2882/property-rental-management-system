import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectAllMaintenanceRequests, selectMaintenanceLoading } from '../../../store/maintenance/maintenance.selectors';
import { selectAllLeases } from '../../../store/leases/leases.selectors';
import { selectAllProperties } from '../../../store/properties/properties.selectors';
import { loadMaintenanceRequests, submitMaintenanceRequest } from '../../../store/maintenance/maintenance.actions';
import { loadLeases } from '../../../store/leases/leases.actions';
import { loadProperties } from '../../../store/properties/properties.actions';
import { MaintenanceRequest } from '../../../core/models/maintenance-model';
import { Property } from '../../../core/models/property-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';
import { RentedPropertyCardComponent } from './components/rented-property-card/rented-property-card';
import { MaintenanceTicketComponent } from './components/maintenance-ticket/maintenance-ticket';
import { PropertyBannerComponent } from './components/property-banner/property-banner';
import { EmergencyPolicySidebarComponent } from './components/emergency-policy-sidebar/emergency-policy-sidebar';
import { RaiseTicketModalComponent } from './components/raise-ticket-modal/raise-ticket-modal';

@Component({
  selector: 'app-maintenance',
  imports: [ CommonModule, RouterLink, IconComponent, LoadingSpinnerComponent, EmptyStateComponent, RentedPropertyCardComponent, MaintenanceTicketComponent, PropertyBannerComponent, EmergencyPolicySidebarComponent, RaiseTicketModalComponent ],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css'
})
export class MaintenanceComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);
  requests$ = this.store.select(selectAllMaintenanceRequests);
  loading$ = this.store.select(selectMaintenanceLoading);
  leases$ = this.store.select(selectAllLeases);
  allProperties$ = this.store.select(selectAllProperties);

  userId = '';
  showPropertiesList = true;
  selectedPropertyId = '';
  selectedProperty: Property | null = null;

  rentedProperties: Property[] = [];
  propertiesMap = new Map<string, Property>();
  myRequests: MaintenanceRequest[] = [];
  filteredRequests: MaintenanceRequest[] = [];

  isModalOpen = false;


  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.store.dispatch(loadMaintenanceRequests({ tenantId: user.id }));
        this.store.dispatch(loadLeases({ tenantId: user.id }));
      }
    });

    // Populate properties map and unique list of properties rented by this customer
    combineLatest([this.leases$, this.allProperties$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([leases, properties]) => {
        this.propertiesMap.clear();
        properties.forEach(p => this.propertiesMap.set(p.id, p));

        const rentedIds = new Set(leases.map(l => l.propertyId));
        this.rentedProperties = properties.filter(p => rentedIds.has(p.id));
        this.sortRentedProperties();
      });

    // Handle view switches based on optional propertyId route parameters
    combineLatest([this.route.params, this.requests$, this.allProperties$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, requests, properties]) => {
        const propId = params['propertyId'];
        this.myRequests = requests;

        if (propId) {
          this.showPropertiesList = false;
          this.selectedPropertyId = propId;
          this.selectedProperty = properties.find(p => p.id === propId) || null;
          
          const propRequests = requests.filter(r => r.propertyId === propId);
          this.filteredRequests = [...propRequests].sort((a, b) => {
            const aOpen = a.status !== 'resolved' ? 1 : 0;
            const bOpen = b.status !== 'resolved' ? 1 : 0;

            if (aOpen > bOpen) return -1;
            if (aOpen < bOpen) return 1;

            const dateA = a.raisedAt ? new Date(a.raisedAt).getTime() : 0;
            const dateB = b.raisedAt ? new Date(b.raisedAt).getTime() : 0;
            return dateB - dateA;
          });
        } 
        else {
          this.showPropertiesList = true;
          this.selectedPropertyId = '';
          this.selectedProperty = null;
          this.filteredRequests = [];
        }
        this.sortRentedProperties();
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  sortRentedProperties(): void {
    if (this.rentedProperties.length === 0) return;

    this.rentedProperties = [...this.rentedProperties].sort((a, b) => {
      const openA = this.getOpenTicketCount(a.id);
      const openB = this.getOpenTicketCount(b.id);

      // 1. Prioritize properties with open tickets
      if (openA > 0 && openB === 0) return -1;
      if (openA === 0 && openB > 0) return 1;

      // 2. If both have open tickets, sort by latest raised ticket date
      if (openA > 0 && openB > 0) {
        const latestA = this.getLatestTicketDate(a.id);
        const latestB = this.getLatestTicketDate(b.id);
        return latestB.getTime() - latestA.getTime();
      }

      // 3. For properties with no open tickets, sort those with any historical tickets first
      const totalA = this.getTicketCount(a.id);
      const totalB = this.getTicketCount(b.id);
      if (totalA > 0 && totalB === 0) return -1;
      if (totalA === 0 && totalB > 0) return 1;

      // If both have resolved tickets, sort by latest ticket date
      if (totalA > 0 && totalB > 0) {
        const latestA = this.getLatestTicketDate(a.id);
        const latestB = this.getLatestTicketDate(b.id);
        return latestB.getTime() - latestA.getTime();
      }

      // Keep original order otherwise
      return 0;
    });
  }


  getLatestTicketDate(propertyId: string): Date {
    const propRequests = this.myRequests.filter(r => r.propertyId === propertyId);
    if (propRequests.length === 0) return new Date(0);

    const sorted = [...propRequests].sort((a, b) => 
      new Date(b.raisedAt || 0).getTime() - new Date(a.raisedAt || 0).getTime()
    );
    return sorted[0].raisedAt ? new Date(sorted[0].raisedAt) : new Date(0);
  }


  getTicketCount(propertyId: string): number {
    return this.myRequests.filter(r => r.propertyId === propertyId).length;
  }


  getOpenTicketCount(propertyId: string): number {
    return this.myRequests.filter(r => r.propertyId === propertyId && r.status !== 'resolved').length;
  }

  openRequestModal(): void {
    this.isModalOpen = true;
  }


  closeRequestModal(): void {
    this.isModalOpen = false;
  }

  
  onSubmit(payload: any): void {
    this.store.dispatch(submitMaintenanceRequest({ request: payload }));
    this.closeRequestModal();
  }
}