import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Materia } from '../../../../core/models/materia.model';

/** Tarjeta de una materia del catálogo. */
@Component({
  selector: 'app-materia-card',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <article class="em-card tarjeta">
      <span class="tarjeta__codigo">{{ materia().codigoMateria }}</span>
      <h3 class="tarjeta__nombre">{{ materia().nombreMateria }}</h3>
      <p class="em-muted tarjeta__meta">{{ materia().carrera }} · {{ 'MATERIAS.CREDITOS_N' | translate: { n: materia().creditos } }}</p>
      @if (conEnlace()) {
        <a routerLink="/app/reservar" [queryParams]="{ materia: materia().id }" class="tarjeta__enlace">{{ 'MATERIAS.RESERVAR_EN' | translate }}</a>
      }
    </article>
  `,
  styles: `
    .tarjeta { padding: var(--em-space-5); height: 100%; box-sizing: border-box; display: flex; flex-direction: column; }
    .tarjeta__codigo { align-self: flex-start; padding: 2px 8px; border-radius: var(--em-radius-sm); background: var(--em-surface-2);
      font-size: .8125rem; font-weight: 700; color: var(--em-indigo); }
    .tarjeta__nombre { font-size: 1.125rem; margin: var(--em-space-3) 0 var(--em-space-1); }
    .tarjeta__meta { font-size: var(--em-text-xs); margin-bottom: var(--em-space-4); }
    .tarjeta__enlace { margin-top: auto; font-weight: 600; }
  `
})
export class MateriaCardComponent {
  readonly materia = input.required<Materia>();
  readonly conEnlace = input(true);
}
