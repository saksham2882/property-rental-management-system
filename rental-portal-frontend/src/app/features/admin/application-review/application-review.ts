import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllApplications, selectApplicationsLoading } from '../../../store/applications/applications.selectors';
import { selectAllProperties } from '../../../store/properties/properties.selectors';
import { loadApplications, updateApplicationStatus } from '../../../store/applications/applications.actions';
import { loadProperties } from '../../../store/properties/properties.actions';
import { createLease } from '../../../store/leases/leases.actions';
import { RentalApplication } from '../../../core/models/application-model';
import { Property } from '../../../core/models/property-model';
import { Lease } from '../../../core/models/lease-model';
import { ApplicationTableListComponent } from './components/application-table-list/application-table-list';
import { LeaseGenerationModalComponent } from './components/lease-generation-modal/lease-generation-modal';
import { ApplicationDetailsModalComponent } from './components/application-details-modal/application-details-modal';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { generateLeaseAgreement } from '../../../core/utils/lease-template';


@Component({
  selector: 'app-application-review',
  imports: [ CommonModule, ApplicationTableListComponent, LeaseGenerationModalComponent, ApplicationDetailsModalComponent, ModalComponent ],
  templateUrl: './application-review.html',
  styleUrl: './application-review.css'
})
export class ApplicationReviewComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  applications$ = this.store.select(selectAllApplications);
  properties$ = this.store.select(selectAllProperties);
  loading$ = this.store.select(selectApplicationsLoading);

  applications: RentalApplication[] = [];
  propertiesMap = new Map<string, Property>();

  isDetailsModalOpen = false;
  selectedAppForDetails: RentalApplication | null = null;

  isRejectModalOpen = false;
  appIdToReject: string | null = null;

  selectedApp: RentalApplication | null = null;
  isLeaseModalOpen = false;


  leaseForm: FormGroup = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    monthlyRent: [null, [Validators.required, Validators.min(1)]],
    deposit: [null, [Validators.required, Validators.min(1)]],
    conditions: ['', Validators.required]
  });


  ngOnInit(): void {
    this.store.dispatch(loadApplications({}));
    this.store.dispatch(loadProperties({}));

    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(props => {
      const newMap = new Map<string, Property>();
      props.forEach(p => newMap.set(p.id, p));
      this.propertiesMap = newMap;
    });

    this.applications$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.applications = [...list].sort((a, b) => {
        const timeA = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const timeB = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return timeB - timeA;
      });
    });

    // Auto calculate lease end date (1 year minus 1 day later) when start date is modified
    this.leaseForm.get('startDate')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      if (val) {
        const start = new Date(val);
        if (!isNaN(start.getTime())) {
          start.setFullYear(start.getFullYear() + 1);
          start.setDate(start.getDate() - 1);
          const endVal = start.toISOString().split('T')[0];
          this.leaseForm.patchValue({ endDate: endVal }, { emitEvent: false });
        }
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPropertyTitle(propertyId: string): string {
    return this.propertiesMap.get(propertyId)?.title || 'Rental Space';
  }

  getPropertyDetails(propertyId: string): Property | undefined {
    return this.propertiesMap.get(propertyId);
  }

  openDetailsModal(app: RentalApplication): void {
    this.selectedAppForDetails = app;
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal(): void {
    this.isDetailsModalOpen = false;
    this.selectedAppForDetails = null;
  }


  openApproveModal(app: RentalApplication): void {
    this.selectedApp = app;
    const property = this.getPropertyDetails(app.propertyId);

    const startDate = app.moveInDate || '';
    let endDate = '';
    if (startDate) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        start.setFullYear(start.getFullYear() + 1);
        start.setDate(start.getDate() - 1);
        endDate = start.toISOString().split('T')[0];
      }
    }

    this.leaseForm.reset({
      startDate: startDate,
      endDate: endDate,
      monthlyRent: property?.rent || app.monthlyIncome * 0.3,
      deposit: property?.deposit || (property?.rent || 0) * 3,
      conditions: `1. The tenant agrees to pay the monthly rent on or before the 5th day of every calendar month.
2. Under no circumstances may a third party occupy the premises without prior administrative checks.
3. A notice period of 30 days is mandatory prior to lease termination request initiation.`
    });
    this.isLeaseModalOpen = true;
    this.isDetailsModalOpen = false;
  }


  closeLeaseModal(): void {
    this.isLeaseModalOpen = false;
    this.selectedApp = null;
  }


  submitLeaseApprove(): void {
    if (this.leaseForm.invalid || !this.selectedApp) {
      this.leaseForm.markAllAsTouched();
      return;
    }

    const formValues = this.leaseForm.value;
    const property = this.getPropertyDetails(this.selectedApp.propertyId);

    const leasePayload: Partial<Lease> = {
      applicationId: this.selectedApp.id,
      propertyId: this.selectedApp.propertyId,
      tenantId: this.selectedApp.customerId,
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      monthlyRent: formValues.monthlyRent,
      deposit: formValues.deposit,
      conditions: formValues.conditions,
      propertyTitle: property?.title || 'Rental Space',
      status: 'pending_signature',
      contractText: generateLeaseAgreement(this.selectedApp, formValues, property),
      createdAt: new Date().toISOString()
    };

    this.store.dispatch(createLease({ lease: leasePayload }));

    if (this.selectedApp.id) {
      this.store.dispatch(updateApplicationStatus({ id: this.selectedApp.id, status: 'approved' }));
    }

    this.closeLeaseModal();
  }


  openRejectConfirm(id: string): void {
    this.appIdToReject = id;
    this.isRejectModalOpen = true;
  }

  closeRejectConfirm(): void {
    this.isRejectModalOpen = false;
    this.appIdToReject = null;
  }

  confirmReject(): void {
    if (this.appIdToReject) {
      this.store.dispatch(updateApplicationStatus({ id: this.appIdToReject, status: 'rejected' }));
      this.closeRejectConfirm();
      this.closeDetailsModal();
    }
  }

  rejectApplication(id: string): void {
    this.openRejectConfirm(id);
  }

  waitlistApplication(id: string): void {
    this.store.dispatch(updateApplicationStatus({ id, status: 'waitlisted' }));
  }
}