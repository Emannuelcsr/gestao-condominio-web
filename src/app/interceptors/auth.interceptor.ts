import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    const requisicaoComToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(requisicaoComToken).pipe(
      catchError((erro: HttpErrorResponse) => {
        if (erro.status === 401) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }

        return throwError(() => erro);
      }),
    );
  }

  return next(req);
};
