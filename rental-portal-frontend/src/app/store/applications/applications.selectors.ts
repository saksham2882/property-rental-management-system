import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationsState } from './applications.reducer';

export const selectApplicationsState = createFeatureSelector<ApplicationsState>('applications');

export const selectAllApplications = createSelector(
  selectApplicationsState,
  (state) => state.applications
);

export const selectApplicationsLoading = createSelector(
  selectApplicationsState,
  (state) => state.loading
);

export const selectApplicationsError = createSelector(
  selectApplicationsState,
  (state) => state.error
);
