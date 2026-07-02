import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

// Restricts a route to specific roles via route data: { roles: ['admin'] }.
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = (route.data?.['roles'] as Role[]) ?? [];
  if (roles.length === 0 || auth.hasRole(...roles)) return true;

  return router.createUrlTree(['/dashboard']);
};
