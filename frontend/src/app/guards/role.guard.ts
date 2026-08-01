import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data?.['roles'] as string[];
  const userRole = auth.getUser()?.role;

  if (requiredRoles?.includes(userRole)) {
    return true;
  }

 return router.createUrlTree(['/dashboard']);
};