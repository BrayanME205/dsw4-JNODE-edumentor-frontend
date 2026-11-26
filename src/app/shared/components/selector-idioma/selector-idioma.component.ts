import { Component, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { IdiomaService } from '../../../core/services/idioma.service';

/** Selector ES / EN. Cada botón dice su idioma en ese mismo idioma (lang) para que el lector lo pronuncie bien. */
@Component({
  selector: 'app-selector-idioma',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="selector" [class.selector--oscuro]="oscuro()" role="group" [attr.aria-label]="'COMUN.IDIOMA' | translate">
      @for (idioma of servicio.idiomas; track idioma) {
        <button type="button" class="selector__opcion" [attr.lang]="idioma" [attr.aria-pressed]="servicio.actual() === idioma"
                [attr.aria-label]="idioma === 'es' ? 'Español' : 'English'" (click)="servicio.cambiar(idioma)">
          {{ idioma.toUpperCase() }}
        </button>
      }
    </div>
  `,
  styles: `
    .selector { display: inline-flex; gap: 2px; padding: 3px; border-radius: 999px; background: rgba(255, 255, 255, .74);
      border: 1px solid var(--em-border); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
    .selector__opcion { min-width: 44px; min-height: 36px; padding: 0 var(--em-space-3); border: 0; border-radius: 999px; background: transparent;
      font: inherit; font-size: .8125rem; font-weight: 700; color: var(--em-text-2); cursor: pointer; }
    .selector__opcion:hover { color: var(--em-text); }
    .selector__opcion[aria-pressed="true"] { background: var(--em-primary); color: #fff; }
    .selector--oscuro { background: rgba(255, 255, 255, .08); border-color: rgba(255, 255, 255, .2); }
    .selector--oscuro .selector__opcion { color: #E7E3F7; }
  `
})
export class SelectorIdiomaComponent {
  readonly servicio = inject(IdiomaService);
  readonly oscuro = input(false);
}
