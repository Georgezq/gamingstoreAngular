import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/firebase/auth/auth.service';
import { inject } from '@angular/core';

export const authVerifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    return true;
  } else {
    return false;
  }
};
