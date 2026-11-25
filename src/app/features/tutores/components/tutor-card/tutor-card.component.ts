import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DiaSemana } from '../../../../core/models/disponibilidad.model';
import { Tutor } from '../../../../core/models/tutor.model';
import { DIAS } from '../../../../core/utils/horario';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { EstrellasComponent } from '../../../../shared/components/estrellas/estrellas.component';

/** Tarjeta de un tutor: nombre, calificación y días en que atiende. */
@Component({
  selector: 'app-tutor-card',
  standalone: true,
  imports: [RouterLink, TranslateModule, AvatarComponent, EstrellasComponent],
  template: `
    <article class="em-card tarjeta">
      <div class="tarjeta__cabecera">
        <app-avatar [nombre]="tutor().nombre + ' ' + tutor().apellido" />
        <div>
          <h3 class="tarjeta__nombre">
            <a [routerLink]="['/tutores', tutor().id]" class="tarjeta__enlace">{{ tutor().nombre }} {{ tutor().apellido }}</a>
          </h3>
          <app-estrellas [valor]="tutor().promedioCalificacion" [total]="tutor().totalEvaluaciones" />
        </div>
      </div>
      @if (dias(); as dias) {
        <p class="em-sr-only">{{ 'TUTORES.ATIENDE' | translate }}</p>
        <ul class="tarjeta__dias">
          @for (dia of todos; track dia) {
            <li [class.activo]="dias.includes(dia)" [attr.aria-hidden]="!dias.includes(dia)">
              <abbr [title]="'DIAS.' + dia | translate">{{ 'DIAS_CORTO.' + dia | translate }}</abbr>
            </li>
          }
        </ul>
        @if (dias.length === 0) {
          <p class="em-muted tarjeta__aviso">{{ 'TUTORES.SIN_HORARIO' | translate }}</p>
        }
      }
    </article>
  `,
  styles: `
    .tarjeta { position: relative; padding: var(--em-space-5); height: 100%; box-sizing: border-box; }
    .tarjeta:hover { border-color: var(--em-primary); }
    .tarjeta__cabecera { display: flex; align-items: center; gap: var(--em-space-3); }
    .tarjeta__nombre { font-size: 1.0625rem; margin: 0 0 2px; }
    .tarjeta__enlace { color: var(--em-text); text-decoration: none; }
    /* Toda la tarjeta es clicable, pero el enlace real sigue siendo el nombre */
    .tarjeta__enlace::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }
    .tarjeta__enlace:focus-visible { outline: none; }
    .tarjeta:has(.tarjeta__enlace:focus-visible) { outline: 3px solid var(--em-focus); outline-offset: 2px; }
    .tarjeta__dias { display: flex; gap: 4px; list-style: none; padding: 0; margin: var(--em-space-4) 0 0; }
    .tarjeta__dias li { flex: 1; text-align: center; padding: 4px 0; border-radius: 8px; font-size: .75rem;
      background: var(--em-surface-2); color: var(--em-text-2); }
    .tarjeta__dias li.activo { background: var(--em-lavender); color: var(--em-indigo); font-weight: 700; }
    .tarjeta__dias abbr { text-decoration: none; }
    .tarjeta__aviso { font-size: .8125rem; margin: var(--em-space-2) 0 0; }
  `
})
export class TutorCardComponent {
  readonly tutor = input.required<Tutor>();
  /** Días con disponibilidad. Si es null no se muestra la franja de días. */
  readonly dias = input<DiaSemana[] | null>(null);
  readonly todos = DIAS;
}
