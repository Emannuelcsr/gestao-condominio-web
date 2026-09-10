import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {


  const authService = inject(AuthService);
  const router = inject(Router);

  const  perfil = authService.obterPerfil();

  if(perfil === 'MORADOR'){
    return router.createUrlTree(['/minhas-solicitacoes']);
  }

  if(perfil === 'ADMINISTRADOR'){
    return router.createUrlTree(['/admin']);
  }

  return true;
};
