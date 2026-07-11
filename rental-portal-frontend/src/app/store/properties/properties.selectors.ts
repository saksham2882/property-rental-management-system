import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertiesState } from './properties.reducer';

export const selectPropertiesState = createFeatureSelector<PropertiesState>('properties');

export const selectAllProperties = createSelector(
  selectPropertiesState,
  (state) => {
    if (!state.properties) return [];
    return [...state.properties].sort((a, b) => {
      const dateA = a.postedAt || '';
      const dateB = b.postedAt || '';
      return dateB.localeCompare(dateA);
    });
  }
);

export const selectSelectedProperty = createSelector(
  selectPropertiesState,
  (state) => state.selectedProperty
);

export const selectPropertyReviews = createSelector(
  selectPropertiesState,
  (state) => state.reviews
);

export const selectPropertiesLoading = createSelector(
  selectPropertiesState,
  (state) => state.loading
);

export const selectPropertiesError = createSelector(
  selectPropertiesState,
  (state) => state.error
);

export const selectPropertiesFilters = createSelector(
  selectPropertiesState,
  (state) => state.filters
);
