import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const customerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isCustomer()) {
    return true;
  }

  if (auth.isLoggedIn() && auth.isAdmin()) {
    router.navigate(['/admin/dashboard']);
  } else {
    router.navigate(['/auth/login']);
  }

  return false;
};
