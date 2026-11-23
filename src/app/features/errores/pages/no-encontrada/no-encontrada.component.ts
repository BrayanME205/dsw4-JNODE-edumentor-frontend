import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-no-encontrada',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="aviso em-escena">
      <span class="em-burbuja em-burbuja--violeta" style="width: 320px; height: 320px; right: -90px; top: -80px" aria-hidden="true"></span>
      <span class="em-burbuja em-burbuja--magenta" style="width: 220px; height: 220px; left: -70px; bottom: -60px" aria-hidden="true"></span>
      <span class="em-burbuja em-burbuja--brillo" style="width: 420px; height: 420px; left: 30%; top: 30%" aria-hidden="true"></span>
      <div class="em-glass aviso__tarjeta">
        <p class="aviso__codigo">{{ 'ERRORES.NO_ENCONTRADA_CODIGO' | translate }}</p>
        <h1 class="em-titulo-seccion aviso__titulo">{{ 'ERRORES.NO_ENCONTRADA_TITULO' | translate }}</h1>
        <p class="em-muted">{{ 'ERRORES.NO_ENCONTRADA_TEXTO' | translate }}</p>
        <div class="em-cluster aviso__acciones">
          <a [routerLink]="destino" class="em-btn em-btn--primary">{{ 'ERRORES.IR_INICIO' | translate }}</a>
          <a routerLink="/tutores" class="em-btn em-btn--secondary">{{ 'LANDING.CTA_TUTORES' | translate }}</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .aviso { min-height: 70vh; display: grid; place-items: center; padding: var(--em-space-7) var(--em-space-5); background: #F4EFFC; }
    .aviso__tarjeta { max-width: 32rem; padding: var(--em-space-7) var(--em-space-6); text-align: center; }
    .aviso__codigo { margin: 0 0 var(--em-space-2); font-weight: 600; color: var(--em-violet-hover); }
    .aviso__titulo { font-size: var(--em-text-2xl); }
    .aviso__acciones { justify-content: center; margin-top: var(--em-space-5); }
  `
})
export class NoEncontradaComponent {
  private readonly auth = inject(AuthService);
  /** Con sesión, "Ir al inicio" lleva al inicio de su rol; sin sesión, a la landing. */
  readonly destino = this.auth.autenticado() ? this.auth.rutaInicio() : '/';
}
