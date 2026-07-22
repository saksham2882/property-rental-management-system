import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { GuestModalService } from '../services/guest-modal-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('auth-token');
  const store = inject(Store);
  const guestModalService = inject(GuestModalService);
  const savedUser = localStorage.getItem('rental_user');
  const isGuest = savedUser ? JSON.parse(savedUser).id?.startsWith('guest-') : false;

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isGuest && (error.status === 403 || error.status === 400)) {
        guestModalService.open();
        return throwError(() => error);
      }
      if (error.status === 401 || error.status === 403) {
        store.dispatch(logout());
      }
      return throwError(() => error);
    })
  );
};