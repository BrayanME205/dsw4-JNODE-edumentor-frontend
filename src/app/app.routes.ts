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
      // Inicio provisional por rol (REQ-15 y REQ-17 lo reemplazan)
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
        loadComponent: () => import('./features/dashboard/pages/bienvenida/bienvenida.component').then((m) => m.BienvenidaComponent)
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
