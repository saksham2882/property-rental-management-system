import { createAction, props } from '@ngrx/store';
import { RentalApplication } from '../../core/models/application-model';

export const loadApplications = createAction(
  '[Applications] Load Applications',
  props<{ customerId?: string; propertyId?: string }>()
);

export const loadApplicationsSuccess = createAction(
  '[Applications] Load Applications Success',
  props<{ applications: RentalApplication[] }>()
);

export const loadApplicationsFailure = createAction(
  '[Applications] Load Applications Failure',
  props<{ error: string }>()
);

export const submitApplication = createAction(
  '[Applications] Submit Application',
  props<{ application: RentalApplication }>()
);

export const submitApplicationSuccess = createAction(
  '[Applications] Submit Application Success',
  props<{ application: RentalApplication }>()
);

export const submitApplicationFailure = createAction(
  '[Applications] Submit Application Failure',
  props<{ error: string }>()
);

export const updateApplicationStatus = createAction(
  '[Applications] Update Application Status',
  props<{ id: string; status: string }>()
);

export const updateApplicationStatusSuccess = createAction(
  '[Applications] Update Application Status Success',
  props<{ application: RentalApplication }>()
);

export const updateApplicationStatusFailure = createAction(
  '[Applications] Update Application Status Failure',
  props<{ error: string }>()
);

export const deleteApplication = createAction(
  '[Applications] Delete Application',
  props<{ id: string }>()
);

export const deleteApplicationSuccess = createAction(
  '[Applications] Delete Application Success',
  props<{ id: string }>()
);

export const deleteApplicationFailure = createAction(
  '[Applications] Delete Application Failure',
  props<{ error: string }>()
);
