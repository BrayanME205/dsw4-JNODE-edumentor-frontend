import { Routes } from '@angular/router';

// Rutas por funcionalidad (carga perezosa con loadComponent). Se agregan por REQ:
//  /login            -> REQ-08  (features/auth)
//  /materias         -> REQ-15  (features/materias)
//  /disponibilidad   -> REQ-16  (features/disponibilidad)
//  /sesiones         -> REQ-17  (features/sesiones)
//  /recursos         -> REQ-18  (features/recursos)
//  /evaluaciones     -> REQ-18  (features/evaluaciones)
// Las protegidas usarán guardas funcionales (CanActivateFn) de core/guards (REQ-08).
export const routes: Routes = [];
