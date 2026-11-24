import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/** Calificación de solo lectura: ★★★★☆ 4.3 (12). Para calificar se usa el formulario de REQ-18. */
@Component({
  selector: 'app-estrellas',
  standalone: true,
  imports: [DecimalPipe, TranslateModule],
  template: `
    @if (total() > 0) {
      <span class="estrellas">
        <span aria-hidden="true" class="estrellas__iconos">{{ iconos() }}</span>
        <span class="em-sr-only">{{ 'TUTORES.CALIFICACION' | translate: { valor: (valor() | number: '1.1-1') } }}</span>
        <strong aria-hidden="true">{{ valor() | number: '1.1-1' }}</strong>
        <span class="em-muted">({{ 'TUTORES.EVALUACIONES_N' | translate: { n: total() } }})</span>
      </span>
    } @else {
      <span class="em-muted estrellas">{{ 'TUTORES.SIN_EVALUACIONES' | translate }}</span>
    }
  `,
  styles: `
    .estrellas { display: inline-flex; align-items: baseline; gap: var(--em-space-1); font-size: var(--em-text-xs); }
    .estrellas__iconos { color: #B45309; letter-spacing: 1px; }
  `
})
export class EstrellasComponent {
  readonly valor = input.required<number>();
  readonly total = input(0);
  readonly iconos = computed(() => {
    const llenas = Math.round(this.valor());
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  });
}
