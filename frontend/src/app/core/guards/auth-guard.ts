import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService } from '../services/token.service';

// Blocks routes for users without a token, redirecting to /login.
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  if (inject(TokenService).has()) return true;

  return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
