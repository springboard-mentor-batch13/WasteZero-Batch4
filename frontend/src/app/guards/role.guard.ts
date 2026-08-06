import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.ensureSession().pipe(
    map((authenticated) => {
      if (!authenticated) return router.createUrlTree(['/login']);
      return allowedRoles.includes(auth.getUser()?.role)
        ? true
        : router.createUrlTree(['/dashboard']);
    }),
  );
};
