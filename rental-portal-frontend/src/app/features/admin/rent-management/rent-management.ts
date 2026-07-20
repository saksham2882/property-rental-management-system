import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { selectAllRents, selectRentLoading } from '../../../store/rent/rent.selectors';
import { loadRents, createRent, markPaid } from '../../../store/rent/rent.actions';
import { UserService } from '../../../core/services/user-service';
import { LeaseService } from '../../../core/services/lease-service';
import { Rent } from '../../../core/models/rent-model';
import { User } from '../../../core/models/user-model';
import { Lease } from '../../../core/models/lease-model';
import { RentTenantSidebarComponent } from './components/rent-tenant-sidebar/rent-tenant-sidebar';
import { RentListComponent } from './components/rent-list/rent-list';
import { CreateRentModalComponent } from './components/create-rent-modal/create-rent-modal';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-rent-management',
  imports: [CommonModule, RentTenantSidebarComponent, RentListComponent, CreateRentModalComponent, IconComponent],
  templateUrl: './rent-management.html',
  styleUrl: './rent-management.css'
})
export class RentManagementComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private userService = inject(UserService);
  private leaseService = inject(LeaseService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  rents$ = this.store.select(selectAllRents);
  loading$ = this.store.select(selectRentLoading);


  rents: Rent[] = [];
  tenants: User[] = [];
  leases: Lease[] = [];
  tenantsMap = new Map<string, string>();
  activeLeases: Lease[] = [];
  selectedTenant: User | null = null;
  selectedLeaseId: string | null = null;
  isFormOpen = false;


  rentForm: FormGroup = this.fb.group({
    tenantId: ['', Validators.required],
    leaseId: ['', Validators.required],
    month: ['June 2026', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    dueDate: ['', Validators.required]
  });


  ngOnInit(): void {
    this.store.dispatch(loadRents({}));

    this.userService.getAllUsers('customer').pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      const newMap = new Map<string, string>();
      list.forEach(u => newMap.set(u.id, u.name));
      this.tenantsMap = newMap;
      this.tenants = [...list];
      this.cdr.markForCheck();
    });

    this.leaseService.getAll().pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      this.leases = [...list];
      this.activeLeases = list.filter(l => l.status === 'active');
      this.cdr.markForCheck();
    });

    this.rents$.pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(list => {
      this.rents = [...list];
      this.cdr.markForCheck();
    });

    this.rentForm.get('tenantId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(tid => {
      if (tid) {
        const lease = this.activeLeases.find(l => l.tenantId === tid);
        if (lease) {
          this.rentForm.patchValue({ leaseId: lease.id, amount: lease.monthlyRent });
        } else {
          this.rentForm.patchValue({ leaseId: '', amount: null });
        }
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSelectTenant(tenant: User): void {
    this.selectedTenant = tenant;
    this.selectedLeaseId = null;
    this.cdr.markForCheck();
  }


  onClearTenant(): void {
    this.selectedTenant = null;
    this.selectedLeaseId = null;
    this.cdr.markForCheck();
  }


  onSelectLease(leaseId: string | null): void {
    this.selectedLeaseId = leaseId;
    this.cdr.markForCheck();
  }


  onClearLeaseFilter(): void {
    this.selectedLeaseId = null;
    this.cdr.markForCheck();
  }


  toggleForm(): void {
    this.isFormOpen = !this.isFormOpen;
    if (this.isFormOpen) {
      this.rentForm.reset({
        month: 'June 2026',
        tenantId: this.selectedTenant ? this.selectedTenant.id : ''
      });
    }
    this.cdr.markForCheck();
  }


  onMarkPaid(id: string): void {
    this.store.dispatch(markPaid({ id }));
  }


  onSubmit(): void {
    if (this.rentForm.invalid) {
      this.rentForm.markAllAsTouched();
      return;
    }

    const payload: Partial<Rent> = {
      ...this.rentForm.value,
      status: 'pending',
      paidDate: null
    };

    this.store.dispatch(createRent({ rent: payload }));
    this.toggleForm();
  }
}
