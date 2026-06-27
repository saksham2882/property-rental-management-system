import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApplicationService } from '../../core/services/application-service';
import { ToastService } from '../../core/services/toast-service';
import * as ApplicationsActions from './applications.actions';

@Injectable()
export class ApplicationsEffects {
  private actions$ = inject(Actions);
  private appService = inject(ApplicationService);
  private toast = inject(ToastService);

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.loadApplications),
      switchMap(({ customerId, propertyId }) => {
        let obs = this.appService.getAll();
        if (customerId) {
          obs = this.appService.getByCustomer(customerId);
        } else if (propertyId) {
          obs = this.appService.getByProperty(propertyId);
        }
        return obs.pipe(
          map((applications) => ApplicationsActions.loadApplicationsSuccess({ applications })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load applications';
            return of(ApplicationsActions.loadApplicationsFailure({ error }));
          })
        );
      })
    )
  );

  submitApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.submitApplication),
      switchMap(({ application }) =>
        this.appService.submit(application).pipe(
          map((created) => {
            this.toast.success('Your application has been submitted successfully!');
            return ApplicationsActions.submitApplicationSuccess({ application: created });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to submit application';
            return of(ApplicationsActions.submitApplicationFailure({ error }));
          })
        )
      )
    )
  );

  updateApplicationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.updateApplicationStatus),
      switchMap(({ id, status }) =>
        this.appService.updateStatus(id, status).pipe(
          map((updated) => {
            this.toast.success(`Application status updated to ${status}`);
            return ApplicationsActions.updateApplicationStatusSuccess({ application: updated });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to update application status';
            return of(ApplicationsActions.updateApplicationStatusFailure({ error }));
          })
        )
      )
    )
  );

  deleteApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationsActions.deleteApplication),
      switchMap(({ id }) =>
        this.appService.delete(id).pipe(
          map(() => {
            this.toast.success('Application deleted successfully.');
            return ApplicationsActions.deleteApplicationSuccess({ id });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to delete application';
            return of(ApplicationsActions.deleteApplicationFailure({ error }));
          })
        )
      )
    )
  );
}
