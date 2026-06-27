import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RentState } from './rent.reducer';

export const selectRentState = createFeatureSelector<RentState>('rent');

export const selectAllRents = createSelector(
  selectRentState,
  (state) => state.rents
);

export const selectRentOrder = createSelector(
  selectRentState,
  (state) => state.order
);

export const selectRentLoading = createSelector(
  selectRentState,
  (state) => state.loading
);

export const selectRentError = createSelector(
  selectRentState,
  (state) => state.error
);
