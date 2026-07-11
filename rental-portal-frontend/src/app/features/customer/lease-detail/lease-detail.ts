import { IconComponent } from '../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectAllLeases, selectLeasesLoading } from '../../../store/leases/leases.selectors';
import { selectAllProperties } from '../../../store/properties/properties.selectors';
import { loadLeases, signLease } from '../../../store/leases/leases.actions';
import { loadProperties } from '../../../store/properties/properties.actions';
import { Lease } from '../../../core/models/lease-model';
import { Property } from '../../../core/models/property-model';
import { ToastService } from '../../../core/services/toast-service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { User } from '../../../core/models/user-model';
import { LeaseCardComponent } from './components/lease-card/lease-card';
import { LeaseDocumentComponent } from './components/lease-document/lease-document';
import { LeaseTimelineComponent } from './components/lease-timeline/lease-timeline';

@Component({
  selector: 'app-lease-detail',
  imports: [ CommonModule, RouterLink, IconComponent, LoadingSpinnerComponent, EmptyStateComponent, ModalComponent, LeaseCardComponent, LeaseDocumentComponent, LeaseTimelineComponent ],
  templateUrl: './lease-detail.html',
  styleUrl: './lease-detail.css'
})
export class LeaseDetailComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

  leases$ = this.store.select(selectAllLeases);
  properties$ = this.store.select(selectAllProperties);
  loading$ = this.store.select(selectLeasesLoading);
  currentUser$ = this.store.select(selectCurrentUser);

  activeLease: Lease | null = null;
  currentUser: User | null = null;
  userId = '';

  allLeases: Lease[] = [];
  showLeaseList = false;
  propertiesMap = new Map<string, Property>();

  isWelcomeModalOpen = false;


  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));

    // Setup map of properties for rendering details in list view cards
    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(props => {
      props.forEach(p => this.propertiesMap.set(p.id, p));
    });

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userId = user.id;
        this.store.dispatch(loadLeases({ tenantId: user.id }));
      }
    });

    // Combine route parameters with leases state changes to dynamically resolve parameterized views
    combineLatest([this.route.params, this.leases$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, leases]) => {

        const leaseId = params['leaseId'];
        if (leases && leases.length > 0) {
          // Sort leases by createdAt descending (latest first)
          this.allLeases = [...leases].sort((a, b) => {
            const dateB = new Date(b.createdAt || b.startDate).getTime();
            const dateA = new Date(a.createdAt || a.startDate).getTime();
            return dateB - dateA;
          });

          if (leaseId) {
            this.showLeaseList = false;
            const found = leases.find(l => l.id === leaseId);

            // Triggers the welcome modal if the activeLease was pending_signature and is now active
            if (this.activeLease && this.activeLease.status === 'pending_signature' && found && found.status === 'active') {
              this.isWelcomeModalOpen = true;
            }
            this.activeLease = found || null;
          } 
          else {
            this.showLeaseList = true;
            this.activeLease = null;
          }
        }
        else {
          this.allLeases = [];
          this.activeLease = null;
          this.showLeaseList = true;
        }
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitSignature(signatureBase64: string): void {
    if (!this.activeLease) return;
    if (!signatureBase64) {
      this.toast.error('Please draw your signature before submitting.');
      return;
    }
    this.store.dispatch(signLease({ id: this.activeLease.id, signatureImage: signatureBase64 }));
  }

  closeWelcomeModal(): void {
    this.isWelcomeModalOpen = false;
    this.router.navigate(['/customer/rent']);
  }

  getPropertyDetails(propertyId: string): Property | undefined {
    return this.propertiesMap.get(propertyId);
  }
}