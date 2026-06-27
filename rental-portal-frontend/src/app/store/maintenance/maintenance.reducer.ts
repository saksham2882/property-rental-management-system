import { createReducer, on } from '@ngrx/store';
import { MaintenanceRequest } from '../../core/models/maintenance-model';
import * as MaintenanceActions from './maintenance.actions';

export interface MaintenanceState {
  requests: MaintenanceRequest[];
  loading: boolean;
  error: string | null;
}

export const initialState: MaintenanceState = {
  requests: [],
  loading: false,
  error: null
};

export const maintenanceReducer = createReducer(
  initialState,
  on(
    MaintenanceActions.loadMaintenanceRequests,
    MaintenanceActions.submitMaintenanceRequest,
    MaintenanceActions.updateMaintenanceRequest,
    (state) => ({
      ...state,
      loading: true,
      error: null
    })
  ),
  
  on(MaintenanceActions.loadMaintenanceRequestsSuccess, (state, { requests }) => ({
    ...state,
    requests,
    loading: false
  })),
  
  on(MaintenanceActions.submitMaintenanceRequestSuccess, (state, { request }) => ({
    ...state,
    requests: [request, ...state.requests],
    loading: false
  })),
  
  on(MaintenanceActions.updateMaintenanceRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests.map((r) => (r.id === request.id ? request : r)),
    loading: false
  })),
  
  on(
    MaintenanceActions.loadMaintenanceRequestsFailure,
    MaintenanceActions.submitMaintenanceRequestFailure,
    MaintenanceActions.updateMaintenanceRequestFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error
    })
  )
);
