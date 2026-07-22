import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { selectAllLeases, selectLeasesLoading } from '../../../store/leases/leases.selectors';
import { loadLeases } from '../../../store/leases/leases.actions';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../core/models/user-model';
import { Lease } from '../../../core/models/lease-model';
import { TenantTableListComponent } from './components/tenant-list/tenant-list';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-tenant-management',
  imports: [ CommonModule, TenantTableListComponent ],
  templateUrl: './tenant-management.html',
  styleUrl: './tenant-management.css'
})
export class TenantManagementComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  leases$ = this.store.select(selectAllLeases);
  loading$ = this.store.select(selectLeasesLoading);
  currentUser$ = this.store.select(selectCurrentUser);

  tenants: User[] = [];
  leases: Lease[] = [];


  ngOnInit(): void {
    this.store.dispatch(loadLeases({}));

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        const isGuestAdmin = user.id?.startsWith('guest-');
        this.userService.getAllUsers('customer').pipe(
          delay(0),
          takeUntil(this.destroy$)
        ).subscribe(list => {
          if (isGuestAdmin) {
            this.tenants = list.filter(u => u.id?.startsWith('guest-'));
          } else {
            this.tenants = [...list];
          }
          this.cdr.markForCheck();
        });
      }
    });

    this.leases$.pipe(
      delay(0),
      takeUntil(this.destroy$)
    ).subscribe(leases => {
      this.leases = [...leases];
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
