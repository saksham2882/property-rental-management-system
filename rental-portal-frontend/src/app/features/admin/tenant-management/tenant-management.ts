import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllLeases, selectLeasesLoading } from '../../../store/leases/leases.selectors';
import { loadLeases } from '../../../store/leases/leases.actions';
import { UserService } from '../../../core/services/user-service';
import { PriceFormatPipe } from '../../../shared/pipes/price-format-pipe';
import { User } from '../../../core/models/user-model';
import { Lease } from '../../../core/models/lease-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

import { TenantTableListComponent } from './components/tenant-list/tenant-list';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [
    CommonModule,
    TenantTableListComponent
  ],
  templateUrl: './tenant-management.html',
  styleUrl: './tenant-management.css'
})
export class TenantManagementComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  leases$ = this.store.select(selectAllLeases);
  loading$ = this.store.select(selectLeasesLoading);

  tenants: User[] = [];
  leases: Lease[] = [];

  ngOnInit(): void {
    this.store.dispatch(loadLeases({}));

    // Fetch list of registered customer tenants
    this.userService.getAllUsers('customer').pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.tenants = list;
    });

    this.leases$.pipe(takeUntil(this.destroy$)).subscribe(leases => {
      this.leases = leases;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
