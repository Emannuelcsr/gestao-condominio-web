import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const moradorGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const perfil = authService.obterPerfil();

  if (perfil === 'MORADOR') {
    return true;
  }

  if (perfil === 'ADMINISTRADOR') {
    return router.createUrlTree(['/admin']);
  }

  return router.createUrlTree(['/login']);
};