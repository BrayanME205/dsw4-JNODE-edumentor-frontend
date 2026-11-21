import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AvisoService } from '../../../core/services/aviso.service';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="avisos" role="status" aria-live="polite">
      @for (aviso of avisoService.avisos(); track aviso.id) {
        <div class="aviso">
          <span class="aviso__icono" [class.aviso__icono--error]="aviso.tipo === 'error'" aria-hidden="true">
            {{ aviso.tipo === 'exito' ? '✓' : '!' }}
          </span>
          <span>{{ aviso.texto }}</span>
          <button type="button" class="aviso__cerrar" [attr.aria-label]="'COMUN.CERRAR_AVISO' | translate" (click)="avisoService.cerrar(aviso.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: `
    .avisos { position: fixed; right: 1rem; bottom: 1rem; z-index: 100; display: grid; gap: .75rem; max-width: min(26rem, calc(100vw - 2rem)); }
    .aviso { display: flex; align-items: center; gap: .75rem; padding: .875rem 1rem; border-radius: 14px;
      background: var(--em-night); color: #fff; box-shadow: var(--em-shadow-pop); }
    .aviso__icono { display: grid; place-items: center; flex: none; width: 1.5rem; height: 1.5rem; border-radius: 50%;
      background: var(--em-success-bg); color: var(--em-success); font-weight: 800; }
    .aviso__icono--error { background: var(--em-danger-bg); color: var(--em-danger); }
    .aviso__cerrar { margin-left: auto; width: 2rem; height: 2rem; border: 0; border-radius: 8px;
      background: rgba(255, 255, 255, .12); color: #fff; cursor: pointer; }
  `
})
export class AvisosComponent {
  readonly avisoService = inject(AvisoService);
}
