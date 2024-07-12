import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/firebase/auth/auth.service';

export const profileGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const verifyToken = localStorage.getItem('whentheuserislogged');
    if (!verifyToken) {
      // Redirige al usuario a la página de inicio de sesión si no hay token
      router.navigate(['/login']);
      return false;
    }

    try {
      const parsedData = JSON.parse(verifyToken);
      const userMainLogged = parsedData.responses.id;
      const userId = route.paramMap.get('id');

      if (userId === userMainLogged) {
        return false;
      } else {
        // Redirige al usuario a una página de acceso denegado o página de inicio
        return true;
      }
    } catch (error) {
      // Maneja el caso en que el token no se pueda parsear
      console.error('Error al parsear el token:', error);
      router.navigate(['/login']);
      return false;
    }

};
