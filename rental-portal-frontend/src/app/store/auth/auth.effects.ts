import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user-service';
import { ToastService } from '../../core/services/toast-service';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../core/services/auth-service';
import { selectCurrentUser } from './auth.selectors';

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions);
  private store = inject(Store);
  private userService = inject(UserService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((res) => {
            localStorage.setItem('auth-token', res.token);
            localStorage.setItem('rental_user', JSON.stringify(res.user));
            this.toast.success(`Welcome back, ${res.user.name}!`);
            return AuthActions.loginSuccess({ token: res.token, user: res.user });
          }),
          catchError((err) => {
            const msg = err.error?.message || err.message || 'Invalid email or password';
            return of(AuthActions.loginFailure({ error: msg }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/customer/dashboard']);
          }
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((res) => {
            localStorage.setItem('auth-token', res.token);
            localStorage.setItem('rental_user', JSON.stringify(res.user));
            this.toast.success('Registration successful!');
            return AuthActions.registerSuccess({ token: res.token, user: res.user });
          }),
          catchError((err) => {
            const msg = (typeof err.error === 'object' ? err.error?.message : err.error) || err.message || 'Registration failed';
            return of(AuthActions.registerFailure({ error: msg }));
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ user }) => {
          if (user.role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/customer/dashboard']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('rental_user');
        this.toast.info('You have logged out successfully.');
        this.router.navigate(['/auth/login']);
        return AuthActions.logoutSuccess();
      })
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      switchMap(({ userId, data }) =>
        this.userService.updateProfile(userId, data).pipe(
          map((user) => {
            localStorage.setItem('rental_user', JSON.stringify(user));
            this.toast.success('Profile updated successfully!');
            return AuthActions.updateProfileSuccess({ user });
          }),
          catchError((err) => {
            const msg = err.error?.message || err.message || 'Failed to update profile';
            return of(AuthActions.updateProfileFailure({ error: msg }));
          })
        )
      )
    )
  );

  addToWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.addToWishlist),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([{ propertyId }, user]) => {
        const userId = user?.id;
        if (!userId) {
          return of(AuthActions.addToWishlistFailure({ error: 'User not logged in' }));
        }
        return this.userService.addToWishlist(userId, propertyId).pipe(
          map(() => {
            this.toast.success('Property added to wishlist.');
            const currentWishlist = user.wishlist || [];
            const wishlist = currentWishlist.includes(propertyId)
              ? currentWishlist
              : [...currentWishlist, propertyId];
            
            const updatedUser = { ...user, wishlist };
            localStorage.setItem('rental_user', JSON.stringify(updatedUser));
            
            return AuthActions.addToWishlistSuccess({ wishlist });
          }),
          catchError((err) => of(AuthActions.addToWishlistFailure({ error: err.message })))
        );
      })
    )
  );

  removeFromWishlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.removeFromWishlist),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([{ propertyId }, user]) => {
        const userId = user?.id;
        if (!userId) {
          return of(AuthActions.removeFromWishlistFailure({ error: 'User not logged in' }));
        }
        return this.userService.removeFromWishlist(userId, propertyId).pipe(
          map(() => {
            this.toast.success('Property removed from wishlist.');
            const currentWishlist = user.wishlist || [];
            const wishlist = currentWishlist.filter((id) => id !== propertyId);
            
            const updatedUser = { ...user, wishlist };
            localStorage.setItem('rental_user', JSON.stringify(updatedUser));
            
            return AuthActions.removeFromWishlistSuccess({ wishlist });
          }),
          catchError((err) => of(AuthActions.removeFromWishlistFailure({ error: err.message })))
        );
      })
    )
  );
}
