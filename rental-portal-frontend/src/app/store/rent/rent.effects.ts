import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RentService } from '../../core/services/rent-service';
import { ToastService } from '../../core/services/toast-service';
import * as RentActions from './rent.actions';

@Injectable()
export class RentEffects {
  private actions$ = inject(Actions);
  private rentService = inject(RentService);
  private toast = inject(ToastService);

  loadRents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.loadRents),
      switchMap(({ tenantId, status }) => {
        const obs = tenantId 
          ? this.rentService.getByTenant(tenantId, status)
          : this.rentService.getAll();
        return obs.pipe(
          map((rents) => RentActions.loadRentsSuccess({ rents })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load rent records';
            return of(RentActions.loadRentsFailure({ error }));
          })
        );
      })
    )
  );

  markPaid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.markPaid),
      switchMap(({ id }) =>
        this.rentService.markPaid(id).pipe(
          map((rent) => {
            this.toast.success('Rent paid successfully (Mock)!');
            return RentActions.markPaidSuccess({ rent });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to mark rent as paid';
            return of(RentActions.markPaidFailure({ error }));
          })
        )
      )
    )
  );

  initiateOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.initiateOrder),
      switchMap(({ id }) =>
        this.rentService.initiateOrder(id).pipe(
          map((order) => RentActions.initiateOrderSuccess({ order })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to initiate payment order';
            return of(RentActions.initiateOrderFailure({ error }));
          })
        )
      )
    )
  );

  verifyPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.verifyPayment),
      switchMap(({ id, payload }) =>
        this.rentService.verifyPayment(id, payload).pipe(
          map((rent) => {
            this.toast.success('Payment verified successfully!');
            return RentActions.verifyPaymentSuccess({ rent });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Payment verification failed';
            return of(RentActions.verifyPaymentFailure({ error }));
          })
        )
      )
    )
  );

  createRent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.createRent),
      switchMap(({ rent }) =>
        this.rentService.create(rent).pipe(
          map((created) => {
            this.toast.success('Rent billing record generated.');
            return RentActions.createRentSuccess({ rent: created });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to generate rent record';
            return of(RentActions.createRentFailure({ error }));
          })
        )
      )
    )
  );

  updateRent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RentActions.updateRent),
      switchMap(({ id, data }) =>
        this.rentService.update(id, data).pipe(
          map((updated) => {
            this.toast.success('Rent billing record updated.');
            return RentActions.updateRentSuccess({ rent: updated });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to update rent record';
            return of(RentActions.updateRentFailure({ error }));
          })
        )
      )
    )
  );
}
