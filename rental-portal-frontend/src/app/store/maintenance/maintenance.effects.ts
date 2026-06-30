import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { MaintenanceService } from '../../core/services/maintenance-service';
import { ToastService } from '../../core/services/toast-service';
import * as MaintenanceActions from './maintenance.actions';

@Injectable()
export class MaintenanceEffects {
  private actions$ = inject(Actions);
  private maintenanceService = inject(MaintenanceService);
  private toast = inject(ToastService);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaintenanceActions.loadMaintenanceRequests),
      switchMap(({ tenantId }) => {
        const obs = tenantId 
          ? this.maintenanceService.getByTenant(tenantId)
          : this.maintenanceService.getAll();
        return obs.pipe(
          map((requests) => MaintenanceActions.loadMaintenanceRequestsSuccess({ requests })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load maintenance requests';
            return of(MaintenanceActions.loadMaintenanceRequestsFailure({ error }));
          })
        );
      })
    )
  );

  submitRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaintenanceActions.submitMaintenanceRequest),
      switchMap(({ request }) =>
        this.maintenanceService.submit(request).pipe(
          map((created) => {
            this.toast.success('Maintenance request raised successfully!');
            return MaintenanceActions.submitMaintenanceRequestSuccess({ request: created });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to file maintenance request';
            return of(MaintenanceActions.submitMaintenanceRequestFailure({ error }));
          })
        )
      )
    )
  );

  updateRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MaintenanceActions.updateMaintenanceRequest),
      switchMap(({ id, data }) =>
        this.maintenanceService.update(id, data).pipe(
          map((updated) => {
            this.toast.success('Maintenance work order updated.');
            return MaintenanceActions.updateMaintenanceRequestSuccess({ request: updated });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to update work order';
            return of(MaintenanceActions.updateMaintenanceRequestFailure({ error }));
          })
        )
      )
    )
  );
}
