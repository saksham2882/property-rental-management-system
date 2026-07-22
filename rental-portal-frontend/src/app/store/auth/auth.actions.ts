import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user-model';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginAsGuest = createAction(
  '[Auth] Login As Guest',
  props<{ role: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string; user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ userData: Partial<User> }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ token: string; user: User }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const loadUserFromStorage = createAction(
  '[Auth] Load User From Storage',
  props<{ user: User; token: string }>()
);

export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ userId: string; data: Partial<User> }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

export const addToWishlist = createAction(
  '[Auth] Add To Wishlist',
  props<{ propertyId: string }>()
);

export const addToWishlistSuccess = createAction(
  '[Auth] Add To Wishlist Success',
  props<{ wishlist: string[] }>()
);

export const addToWishlistFailure = createAction(
  '[Auth] Add To Wishlist Failure',
  props<{ error: string }>()
);

export const removeFromWishlist = createAction(
  '[Auth] Remove From Wishlist',
  props<{ propertyId: string }>()
);

export const removeFromWishlistSuccess = createAction(
  '[Auth] Remove From Wishlist Success',
  props<{ wishlist: string[] }>()
);

export const removeFromWishlistFailure = createAction(
  '[Auth] Remove From Wishlist Failure',
  props<{ error: string }>()
);
