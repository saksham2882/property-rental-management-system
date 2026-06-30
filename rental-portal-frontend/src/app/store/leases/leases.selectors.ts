import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeasesState } from './leases.reducer';

export const selectLeasesState = createFeatureSelector<LeasesState>('leases');

export const selectAllLeases = createSelector(
  selectLeasesState,
  (state) => state.leases
);

export const selectSelectedLease = createSelector(
  selectLeasesState,
  (state) => state.selectedLease
);

export const selectLeasesLoading = createSelector(
  selectLeasesState,
  (state) => state.loading
);

export const selectLeasesError = createSelector(
  selectLeasesState,
  (state) => state.error
);
