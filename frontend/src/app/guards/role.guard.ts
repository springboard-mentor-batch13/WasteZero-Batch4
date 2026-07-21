import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const role = auth.getUser()?.role;

  return allowedRoles?.includes(role)
    ? true
    : router.createUrlTree(['/dashboard']);
};

export const objectIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const id = route.paramMap.get('id') || '';

  return /^[a-f\d]{24}$/i.test(id)
    ? true
    : router.createUrlTree(['/opportunities']);
};
