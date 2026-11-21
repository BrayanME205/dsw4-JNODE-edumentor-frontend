import { Routes } from '@angular/router';

import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

/**
 * Rutas de la aplicación. Cada pantalla se carga de forma perezosa (loadComponent).
 * Los títulos son claves de traducción (TITULOS.*).
 */
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        title: 'TITULOS.INICIO',
        loadComponent: () => import('./features/public/pages/landing/landing.component').then((m) => m.LandingComponent)
      }
    ]
  }
];
