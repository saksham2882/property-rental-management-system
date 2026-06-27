import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state) => !!state.user
);

export const selectIsAdmin = createSelector(
  selectAuthState,
  (state) => state.user?.role === 'admin'
);

export const selectIsCustomer = createSelector(
  selectAuthState,
  (state) => state.user?.role === 'customer'
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectUserWishlist = createSelector(
  selectCurrentUser,
  (user) => user?.wishlist || []
);
