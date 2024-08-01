import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/firebase/auth/auth.service';
import Swal from 'sweetalert2'


export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    Swal.fire("Ya se encuentra logueado!", "", "info");
    router.navigate(['home']);
    return false;
  } else {
    return true;
  }
};
