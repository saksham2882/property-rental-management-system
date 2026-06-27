import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCurrentUser } from '../../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map((user) => {
      if (user) {
        if (user.role === 'admin') {
          return true;
        }
        router.navigate(['/customer/dashboard']);
        return false;
      }

      router.navigate(['/auth/login']);
      return false;
    })
  );
};
