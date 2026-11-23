import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Rol } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

/**
 * Fábrica de guardas por rol: roleGuard('TUTOR') o roleGuard('ESTUDIANTE', 'TUTOR').
 * Con un rol que no corresponde, lleva a /sin-permiso.
 */
export function roleGuard(...roles: Rol[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    return auth.tieneRol(...roles) ? true : inject(Router).createUrlTree(['/sin-permiso']);
  };
}
