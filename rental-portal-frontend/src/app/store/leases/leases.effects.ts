import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { LeaseService } from '../../core/services/lease-service';
import { ToastService } from '../../core/services/toast-service';
import * as LeasesActions from './leases.actions';

@Injectable()
export class LeasesEffects {
  private actions$ = inject(Actions);
  private leaseService = inject(LeaseService);
  private toast = inject(ToastService);

  loadLeases$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeasesActions.loadLeases),
      switchMap(({ tenantId }) => {
        const obs = tenantId 
          ? this.leaseService.getByTenant(tenantId)
          : this.leaseService.getAll();
        return obs.pipe(
          map((leases) => LeasesActions.loadLeasesSuccess({ leases })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load leases';
            return of(LeasesActions.loadLeasesFailure({ error }));
          })
        );
      })
    )
  );

  loadLeaseById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeasesActions.loadLeaseById),
      switchMap(({ id }) =>
        this.leaseService.getById(id).pipe(
          map((lease) => LeasesActions.loadLeaseByIdSuccess({ lease })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load lease details';
            return of(LeasesActions.loadLeaseByIdFailure({ error }));
          })
        )
      )
    )
  );

  createLease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeasesActions.createLease),
      switchMap(({ lease }) =>
        this.leaseService.create(lease).pipe(
          map((created) => {
            this.toast.success('Lease agreement generated successfully!');
            return LeasesActions.createLeaseSuccess({ lease: created });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to generate lease agreement';
            return of(LeasesActions.createLeaseFailure({ error }));
          })
        )
      )
    )
  );

  signLease$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeasesActions.signLease),
      switchMap(({ id, signatureImage }) =>
        this.leaseService.signLease(id, signatureImage).pipe(
          map((signed) => {
            this.toast.success('Lease signed successfully! Welcome home.');
            return LeasesActions.signLeaseSuccess({ lease: signed });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to sign lease agreement';
            return of(LeasesActions.signLeaseFailure({ error }));
          })
        )
      )
    )
  );
}
