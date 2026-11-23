import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Rol } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconoComponent } from '../../shared/components/icono/icono.component';
import { LogoComponent } from '../../shared/components/logo/logo.component';

interface ItemMenu {
  clave: string;
  ruta: string;
  icono: string;
}

/** Menú de cada rol. Las rutas apuntan a las pantallas de los REQ 15 a 18. */
const MENU: Record<Rol, ItemMenu[]> = {
  ESTUDIANTE: [
    { clave: 'APP.MENU_INICIO', ruta: '/app/estudiante', icono: 'inicio' },
    { clave: 'APP.MENU_RESERVAR', ruta: '/app/reservar', icono: 'reservar' },
    { clave: 'APP.MENU_TUTORIAS', ruta: '/app/tutorias', icono: 'tutorias' },
    { clave: 'APP.MENU_TUTORES', ruta: '/tutores', icono: 'tutores' },
    { clave: 'APP.MENU_MATERIAS', ruta: '/materias', icono: 'materias' }
  ],
  TUTOR: [
    { clave: 'APP.MENU_INICIO', ruta: '/app/tutor', icono: 'inicio' },
    { clave: 'APP.MENU_TUTORIAS', ruta: '/app/tutorias', icono: 'tutorias' },
    { clave: 'APP.MENU_DISPONIBILIDAD', ruta: '/app/disponibilidad', icono: 'disponibilidad' }
  ],
  COORDINADOR: [
    { clave: 'APP.MENU_INICIO', ruta: '/app/coordinacion', icono: 'inicio' },
    { clave: 'APP.MENU_MATERIAS', ruta: '/app/materias', icono: 'materias' },
    { clave: 'APP.MENU_SUPERVISION', ruta: '/app/supervision', icono: 'supervision' },
    { clave: 'APP.MENU_TUTORES', ruta: '/tutores', icono: 'tutores' }
  ]
};

/**
 * Estructura de la app autenticada: menú lateral en escritorio y
 * barra superior + barra inferior en el celular.
 */
@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule, LogoComponent, AvatarComponent, IconoComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuario;
  readonly menu = computed(() => {
    const rol = this.auth.rol();
    return rol ? MENU[rol] : [];
  });
  readonly inicio = computed(() => this.menu()[0]?.ruta ?? '/');
  /** En el celular la barra inferior muestra como máximo 4 accesos. */
  readonly menuMovil = computed(() => this.menu().slice(0, 4));

  salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
