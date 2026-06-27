import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user-model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, AuthActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { token, user }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState
  })),

  on(AuthActions.loadUserFromStorage, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  
  on(AuthActions.addToWishlistSuccess, AuthActions.removeFromWishlistSuccess, (state, { wishlist }) => {
    if (state.user) {
      return {
        ...state,
        user: {
          ...state.user,
          wishlist
        }
      };
    }
    return state;
  })
);
