import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const perfil = authService.obterPerfil();

  if (perfil === 'ADMINISTRADOR') {
    return true;
  }

  if (perfil === 'MORADOR') {
    return router.createUrlTree(['/minhas-solicitacoes']);
  }

  return router.createUrlTree(['/login']);
};
