import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/firebase/auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedEmails: string[] = [
    'yosho2mendoza@gmail.com',
    'user2@example.com',
    // Agrega aquí los correos electrónicos permitidos
  ];

  const userEmail = authService.getUserEmail();
  if (allowedEmails.includes(userEmail)) {
    return true;
  } else {
    router.navigate(['/not-authorized']);
    return false;
  }
};
