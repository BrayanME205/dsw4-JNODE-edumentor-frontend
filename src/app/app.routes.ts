import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { AuthService } from './core/services/auth.service';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

/**
 * Rutas de la aplicación. Cada pantalla se carga de forma perezosa (loadComponent).
 * Los títulos son claves de traducción (TITULOS.*).
 */
export const routes: Routes = [
  // ---------- Acceso (pantalla completa, sin encabezado público) ----------
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'TITULOS.LOGIN',
    loadComponent: () => import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    title: 'TITULOS.REGISTRO',
    loadComponent: () => import('./features/auth/pages/registro/registro.component').then((m) => m.RegistroComponent)
  },

  // ---------- App autenticada ----------
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: () => inject(AuthService).rutaInicio() },
      // Inicio provisional de estudiante y tutor (REQ-17 lo reemplaza)
      {
        path: 'estudiante',
        canActivate: [roleGuard('ESTUDIANTE')],
        title: 'TITULOS.INICIO',
        loadComponent: () => import('./features/dashboard/pages/bienvenida/bienvenida.component').then((m) => m.BienvenidaComponent)
      },
      {
        path: 'tutor',
        canActivate: [roleGuard('TUTOR')],
        title: 'TITULOS.INICIO',
        loadComponent: () => import('./features/dashboard/pages/bienvenida/bienvenida.component').then((m) => m.BienvenidaComponent)
      },
      {
        path: 'coordinacion',
        canActivate: [roleGuard('COORDINADOR')],
        title: 'TITULOS.INICIO',
        loadComponent: () =>
          import('./features/materias/pages/inicio-coordinador/inicio-coordinador.component').then((m) => m.InicioCoordinadorComponent)
      },
      {
        path: 'disponibilidad',
        canActivate: [roleGuard('TUTOR')],
        title: 'TITULOS.DISPONIBILIDAD',
        loadComponent: () => import('./features/tutores/pages/mi-disponibilidad/mi-disponibilidad.component').then((m) => m.MiDisponibilidadComponent)
      },
      {
        path: 'materias',
        canActivate: [roleGuard('COORDINADOR')],
        title: 'TITULOS.MATERIAS_ADMIN',
        loadComponent: () => import('./features/materias/pages/materias-admin/materias-admin.component').then((m) => m.MateriasAdminComponent)
      }
    ]
  },

  // ---------- Público ----------
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'TITULOS.INICIO',
        loadComponent: () => import('./features/public/pages/landing/landing.component').then((m) => m.LandingComponent)
      },
      {
        path: 'materias',
        title: 'TITULOS.MATERIAS',
        loadComponent: () => import('./features/materias/pages/explorar-materias/explorar-materias.component').then((m) => m.ExplorarMateriasComponent)
      },
      {
        path: 'tutores',
        title: 'TITULOS.TUTORES',
        loadComponent: () => import('./features/tutores/pages/explorar-tutores/explorar-tutores.component').then((m) => m.ExplorarTutoresComponent)
      },
      {
        path: 'tutores/:id',
        title: 'TITULOS.PERFIL_TUTOR',
        loadComponent: () => import('./features/tutores/pages/perfil-tutor/perfil-tutor.component').then((m) => m.PerfilTutorComponent)
      },
      {
        path: 'sin-permiso',
        title: 'TITULOS.SIN_PERMISO',
        loadComponent: () => import('./features/errores/pages/sin-permiso/sin-permiso.component').then((m) => m.SinPermisoComponent)
      },
      {
        path: '**',
        title: 'TITULOS.NO_ENCONTRADA',
        loadComponent: () => import('./features/errores/pages/no-encontrada/no-encontrada.component').then((m) => m.NoEncontradaComponent)
      }
    ]
  }
];
