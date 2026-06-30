import { createAction, props } from '@ngrx/store';
import { MaintenanceRequest } from '../../core/models/maintenance-model';

export const loadMaintenanceRequests = createAction(
  '[Maintenance] Load Maintenance Requests',
  props<{ tenantId?: string }>()
);

export const loadMaintenanceRequestsSuccess = createAction(
  '[Maintenance] Load Maintenance Requests Success',
  props<{ requests: MaintenanceRequest[] }>()
);

export const loadMaintenanceRequestsFailure = createAction(
  '[Maintenance] Load Maintenance Requests Failure',
  props<{ error: string }>()
);

export const submitMaintenanceRequest = createAction(
  '[Maintenance] Submit Maintenance Request',
  props<{ request: Partial<MaintenanceRequest> }>()
);

export const submitMaintenanceRequestSuccess = createAction(
  '[Maintenance] Submit Maintenance Request Success',
  props<{ request: MaintenanceRequest }>()
);

export const submitMaintenanceRequestFailure = createAction(
  '[Maintenance] Submit Maintenance Request Failure',
  props<{ error: string }>()
);

export const updateMaintenanceRequest = createAction(
  '[Maintenance] Update Maintenance Request',
  props<{ id: string; data: Partial<MaintenanceRequest> }>()
);

export const updateMaintenanceRequestSuccess = createAction(
  '[Maintenance] Update Maintenance Request Success',
  props<{ request: MaintenanceRequest }>()
);

export const updateMaintenanceRequestFailure = createAction(
  '[Maintenance] Update Maintenance Request Failure',
  props<{ error: string }>()
);
