import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MaintenanceState } from './maintenance.reducer';

export const selectMaintenanceState = createFeatureSelector<MaintenanceState>('maintenance');

export const selectAllMaintenanceRequests = createSelector(
  selectMaintenanceState,
  (state) => state.requests
);

export const selectMaintenanceLoading = createSelector(
  selectMaintenanceState,
  (state) => state.loading
);

export const selectMaintenanceError = createSelector(
  selectMaintenanceState,
  (state) => state.error
);
