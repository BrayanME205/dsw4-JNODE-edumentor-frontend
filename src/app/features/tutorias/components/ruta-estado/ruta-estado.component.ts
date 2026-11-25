import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EstadoTutoria } from '../../../../core/models/sesion.model';
import { RUTA } from '../../../../core/utils/sesion-reglas';

type Paso = 'hecho' | 'actual' | 'pendiente' | 'corte';

interface Parada {
  clave: string;
  paso: Paso;
}

/**
 * Elemento firma 1: el estado de la tutoría como un recorrido de 5 paradas.
 * Si fue rechazada o cancelada, la ruta se corta en rojo en la segunda parada.
 */
@Component({
  selector: 'app-ruta-estado',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <ol class="em-ruta" [style.--progreso]="progreso()" [attr.data-cortada]="cortada()" [attr.aria-label]="'RUTA.TITULO' | translate">
      @for (parada of paradas(); track parada.clave) {
        <li class="em-ruta__parada" [attr.data-paso]="parada.paso" [attr.aria-current]="parada.paso === 'actual' || parada.paso === 'corte' ? 'step' : null">
          {{ 'ESTADOS.' + parada.clave | translate }}
        </li>
      }
    </ol>
  `
})
export class RutaEstadoComponent {
  readonly estado = input.required<EstadoTutoria>();

  readonly cortada = computed(() => this.estado() === 'REJECTED' || this.estado() === 'CANCELLED');

  /** Índice de la parada actual (0 a 4). En una ruta cortada, el corte cae en la parada 1. */
  private readonly indice = computed(() => (this.cortada() ? 1 : RUTA.indexOf(this.estado())));

  /** De 0 a 1: cuánto de la línea se pinta. */
  readonly progreso = computed(() => this.indice() / (RUTA.length - 1));

  readonly paradas = computed<Parada[]>(() =>
    RUTA.map((clave, i) => {
      if (this.cortada() && i === 1) return { clave: this.estado(), paso: 'corte' };
      if (i < this.indice()) return { clave, paso: 'hecho' };
      if (i === this.indice()) return { clave, paso: this.estado() === 'REVIEWED' ? 'hecho' : 'actual' };
      return { clave, paso: 'pendiente' };
    })
  );
}
