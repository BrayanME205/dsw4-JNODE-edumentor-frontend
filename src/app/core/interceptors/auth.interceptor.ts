import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional:
 * 1. Adjunta "Authorization: Bearer <token>" a toda petición hacia la API.
 * 2. Si la API responde 401 (token vencido o inválido), cierra la sesión y lleva al login.
 *
 * Las peticiones que no van a la API (por ejemplo los JSON de traducciones) pasan sin tocarse.
 * Esto además evita una dependencia circular al arrancar: ngx-translate pide es.json mientras se
 * está creando, y si aquí se inyectara el Router se crearía el TitleStrategy, que necesita a ngx-translate.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const injector = inject(Injector); // el Router se pide solo si hace falta (ante un 401)
  const token = auth.token;

  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const esLogin = req.url.includes('/auth/');
      if (error.status === 401 && !esLogin && auth.autenticado()) {
        auth.logout();
        injector.get(Router).navigate(['/login'], { queryParams: { expirada: 1 } });
      }
      return throwError(() => error);
    })
  );
};
