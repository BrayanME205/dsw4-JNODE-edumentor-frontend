import { Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** Esqueletos con la forma de una lista mientras llega la respuesta de la API. */
@Component({
  selector: 'app-cargando',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div aria-busy="true" class="em-stack">
      <span class="em-sr-only" role="status">{{ 'COMUN.CARGANDO' | translate }}</span>
      @for (fila of filasArray(); track fila) {
        <div class="em-card esqueleto" aria-hidden="true">
          <span class="em-skel circulo"></span>
          <span class="lineas"><span class="em-skel" style="width: 40%; height: 16px"></span><span class="em-skel" style="width: 65%; height: 12px"></span></span>
          <span class="em-skel" style="width: 96px; height: 36px; border-radius: 10px"></span>
        </div>
      }
    </div>
  `,
  styles: `
    .esqueleto { display: flex; align-items: center; gap: var(--em-space-5); padding: var(--em-space-4) var(--em-space-5); }
    .circulo { width: 44px; height: 44px; border-radius: 50%; flex: none; }
    .lineas { flex: 1; display: grid; gap: var(--em-space-2); }
  `
})
export class CargandoComponent {
  readonly filas = input(3);
  readonly filasArray = computed(() => Array.from({ length: this.filas() }, (_, i) => i));
}
