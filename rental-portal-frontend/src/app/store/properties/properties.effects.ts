import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PropertyService } from '../../core/services/property-service';
import { ToastService } from '../../core/services/toast-service';
import * as PropertiesActions from './properties.actions';

@Injectable()
export class PropertiesEffects {
  private actions$ = inject(Actions);
  private propertyService = inject(PropertyService);
  private toast = inject(ToastService);

  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperties),
      switchMap(({ filters }) => {
        const obs = filters 
          ? this.propertyService.getFiltered(filters)
          : this.propertyService.getAll();
        return obs.pipe(
          map((properties) => PropertiesActions.loadPropertiesSuccess({ properties })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load properties';
            return of(PropertiesActions.loadPropertiesFailure({ error }));
          })
        );
      })
    )
  );

  loadPropertyById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadPropertyById),
      switchMap(({ id }) =>
        this.propertyService.getById(id).pipe(
          map((property) => PropertiesActions.loadPropertyByIdSuccess({ property })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load property details';
            return of(PropertiesActions.loadPropertyByIdFailure({ error }));
          })
        )
      )
    )
  );

  createProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.createProperty),
      switchMap(({ property }) =>
        this.propertyService.create(property).pipe(
          map((created) => {
            this.toast.success('Property listed successfully!');
            return PropertiesActions.createPropertySuccess({ property: created });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to list property';
            return of(PropertiesActions.createPropertyFailure({ error }));
          })
        )
      )
    )
  );

  updateProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.updateProperty),
      switchMap(({ id, data }) =>
        this.propertyService.update(id, data).pipe(
          map((updated) => {
            this.toast.success('Property updated successfully!');
            return PropertiesActions.updatePropertySuccess({ property: updated });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to update property';
            return of(PropertiesActions.updatePropertyFailure({ error }));
          })
        )
      )
    )
  );

  deleteProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.deleteProperty),
      switchMap(({ id }) =>
        this.propertyService.delete(id).pipe(
          map(() => {
            this.toast.success('Property deleted successfully.');
            return PropertiesActions.deletePropertySuccess({ id });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to delete property';
            return of(PropertiesActions.deletePropertyFailure({ error }));
          })
        )
      )
    )
  );

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadReviews),
      switchMap(({ propertyId }) =>
        this.propertyService.getReviews(propertyId).pipe(
          map((reviews) => PropertiesActions.loadReviewsSuccess({ reviews })),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to load reviews';
            return of(PropertiesActions.loadReviewsFailure({ error }));
          })
        )
      )
    )
  );

  addReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.addReview),
      switchMap(({ propertyId, review }) =>
        this.propertyService.addReview(propertyId, review).pipe(
          map((added) => {
            this.toast.success('Review added successfully.');
            return PropertiesActions.addReviewSuccess({ review: added });
          }),
          catchError((err) => {
            const error = err.error?.message || err.message || 'Failed to add review';
            return of(PropertiesActions.addReviewFailure({ error }));
          })
        )
      )
    )
  );
}
