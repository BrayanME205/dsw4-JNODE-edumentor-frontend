import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EstadoTutoria } from '../../../core/models/sesion.model';
import { claseEstado } from '../../../core/utils/sesion-reglas';

/** Etiqueta de color con el estado de una tutoría. El color nunca va solo: siempre lleva texto. */
@Component({
  selector: 'app-estado-badge',
  standalone: true,
  imports: [TranslateModule],
  template: `<span class="em-badge" [class]="'em-badge--' + clase()">{{ 'ESTADOS.' + estado() | translate }}</span>`
})
export class EstadoBadgeComponent {
  readonly estado = input.required<EstadoTutoria>();
  readonly clase = computed(() => claseEstado(this.estado()));
}
