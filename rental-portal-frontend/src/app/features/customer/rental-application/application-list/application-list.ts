import { IconComponent } from '../../../../shared/components/icon/icon';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllApplications, selectApplicationsLoading } from '../../../../store/applications/applications.selectors';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { selectAllProperties } from '../../../../store/properties/properties.selectors';
import { selectAllLeases } from '../../../../store/leases/leases.selectors';
import { loadApplications, deleteApplication } from '../../../../store/applications/applications.actions';
import { loadProperties } from '../../../../store/properties/properties.actions';
import { loadLeases } from '../../../../store/leases/leases.actions';
import { RentalApplication } from '../../../../core/models/application-model';
import { Property } from '../../../../core/models/property-model';
import { Lease } from '../../../../core/models/lease-model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ApplicationCardComponent } from './components/application-card/application-card';

@Component({
  selector: 'app-application-list',
  imports: [ CommonModule, IconComponent, LoadingSpinnerComponent, EmptyStateComponent, ModalComponent, ApplicationCardComponent ],
  templateUrl: './application-list.html',
  styleUrl: './application-list.css'
})
export class ApplicationListComponent implements OnInit {

  private store = inject(Store);
  private destroy$ = new Subject<void>();

  applications$ = this.store.select(selectAllApplications);
  properties$ = this.store.select(selectAllProperties);
  leases$ = this.store.select(selectAllLeases);
  loading$ = this.store.select(selectApplicationsLoading);
  currentUser$ = this.store.select(selectCurrentUser);

  propertiesMap = new Map<string, Property>();
  myApplications: RentalApplication[] = [];
  myLeases: Lease[] = [];

  isCancelModalOpen = false;
  appIdToCancel: string | null = null;


  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));

    // Setup map of properties for fast rendering titles
    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(props => {
      props.forEach(p => this.propertiesMap.set(p.id, p));
    });

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.store.dispatch(loadApplications({ customerId: user.id }));
        this.store.dispatch(loadLeases({ tenantId: user.id }));
      }
    });

    combineLatest([this.applications$, this.leases$, this.currentUser$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([apps, leases, user]) => {
        if (leases) {
          this.myLeases = leases;
        }
        if (apps && user) {
          this.myApplications = apps.filter(a => a.customerId === user.id);
        } else {
          this.myApplications = [];
        }
      });
  }

  isLeaseSignedForApp(appId: string | undefined): boolean {
    if (!appId) return false;
    const lease = this.myLeases.find(l => l.applicationId === appId);
    return !!lease && lease.status === 'active';
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  openCancelModal(id: string | undefined): void {
    if (!id) return;
    this.appIdToCancel = id;
    this.isCancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.appIdToCancel = null;
  }

  confirmCancel(): void {
    if (this.appIdToCancel) {
      this.store.dispatch(deleteApplication({ id: this.appIdToCancel }));
    }
    this.closeCancelModal();
  }

  getPropertyTitle(propertyId: string): string {
    return this.propertiesMap.get(propertyId)?.title || 'Rental Space';
  }

  getPropertyDetails(propertyId: string): Property | undefined {
    return this.propertiesMap.get(propertyId);
  }
}
