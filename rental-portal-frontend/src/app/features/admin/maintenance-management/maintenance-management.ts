import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { selectAllMaintenanceRequests, selectMaintenanceLoading } from '../../../store/maintenance/maintenance.selectors';
import { loadMaintenanceRequests, updateMaintenanceRequest } from '../../../store/maintenance/maintenance.actions';
import { UserService } from '../../../core/services/user-service';
import { LeaseService } from '../../../core/services/lease-service';
import { MaintenanceRequest } from '../../../core/models/maintenance-model';
import { User } from '../../../core/models/user-model';
import { Lease } from '../../../core/models/lease-model';
import { MaintenanceSidebarComponent } from './components/maintenance-sidebar/maintenance-sidebar';
import { MaintenanceRequestListComponent } from './components/maintenance-request-list/maintenance-request-list';
import { MaintenanceResolveModalComponent } from './components/maintenance-resolve-modal/maintenance-resolve-modal';

@Component({
  selector: 'app-maintenance-management',
  imports: [ CommonModule, MaintenanceSidebarComponent, MaintenanceRequestListComponent, MaintenanceResolveModalComponent ],
  templateUrl: './maintenance-management.html',
  styleUrl: './maintenance-management.css'
})
export class MaintenanceManagementComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private userService = inject(UserService);
  private leaseService = inject(LeaseService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  requests$ = this.store.select(selectAllMaintenanceRequests);
  loading$ = this.store.select(selectMaintenanceLoading);

  requests: MaintenanceRequest[] = [];
  tenants: User[] = [];
  leases: Lease[] = [];
  tenantsMap = new Map<string, string>();

  selectedTenantId: string | null = null;
  selectedUrgency: string | null = null;

  selectedRequest: MaintenanceRequest | null = null;
  isModalOpen = false;


  resolveForm: FormGroup = this.fb.group({
    status: ['in_progress', Validators.required],
    adminNote: ['', Validators.required]
  });


  ngOnInit(): void {
    this.store.dispatch(loadMaintenanceRequests({}));

    this.userService.getAllUsers('customer').pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      this.tenants = list;
      list.forEach(u => this.tenantsMap.set(u.id, u.name));
      this.cdr.markForCheck();
    });

    this.leaseService.getAll().pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      this.leases = list;
      this.cdr.markForCheck();
    });

    this.requests$.pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      this.requests = list || [];
      this.cdr.markForCheck();
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSelectTenantId(id: string | null): void {
    this.selectedTenantId = id;
    this.cdr.markForCheck();
  }


  onSelectUrgency(urgency: string | null): void {
    this.selectedUrgency = urgency;
    this.cdr.markForCheck();
  }


  openResolveModal(req: MaintenanceRequest): void {
    this.selectedRequest = req;
    this.resolveForm.reset({
      status: (req.status || 'pending').toLowerCase() === 'pending' ? 'in_progress' : req.status,
      adminNote: req.adminNote || ''
    });
    this.isModalOpen = true;
    this.cdr.markForCheck();
  }


  closeResolveModal(): void {
    this.isModalOpen = false;
    this.selectedRequest = null;
    this.cdr.markForCheck();
  }


  submitResolution(): void {
    if (this.resolveForm.invalid || !this.selectedRequest || !this.selectedRequest.id) {
      this.resolveForm.markAllAsTouched();
      return;
    }

    const formValues = this.resolveForm.value;
    const resolvedAt = formValues.status === 'resolved'
      ? new Date().toISOString().split('T')[0]
      : null;

    const updatePayload = {
      status: formValues.status,
      adminNote: formValues.adminNote,
      resolvedAt
    };

    this.store.dispatch(updateMaintenanceRequest({
      id: this.selectedRequest.id,
      data: updatePayload
    }));

    this.closeResolveModal();
  }
}
