import { Component, input } from '@angular/core';

import { LogoComponent } from '../../../../shared/components/logo/logo.component';

/**
 * Estructura compartida de login y registro: a la izquierda el mensaje con la ilustración,
 * a la derecha el formulario en una tarjeta de vidrio sobre burbujas.
 */
@Component({
  selector: 'app-marco-auth',
  standalone: true,
  imports: [LogoComponent],
  template: `
    <div class="marco">
      <section class="marco__lado">
        <app-logo />
        <p class="em-display marco__frase">{{ frase() }}</p>
        <img [src]="imagen()" alt="" class="marco__img">
      </section>
      <main id="contenido" class="marco__principal em-escena">
        <span class="em-burbuja em-burbuja--violeta" style="width: 280px; height: 280px; right: -150px; top: 22%" aria-hidden="true"></span>
        <span class="em-burbuja em-burbuja--magenta" style="width: 200px; height: 200px; left: -70px; bottom: -60px" aria-hidden="true"></span>
        <span class="em-burbuja em-burbuja--brillo" style="width: 380px; height: 380px; left: 20%; top: 30%" aria-hidden="true"></span>
        <div class="marco__barra"><ng-content select="[barra]" /></div>
        <div class="em-glass marco__tarjeta"><ng-content /></div>
      </main>
    </div>
  `,
  styles: `
    .marco { display: flex; flex-wrap: wrap; min-height: 100vh; }
    .marco__lado { flex: 1 1 420px; background: #F4EFFC; padding: var(--em-space-6) var(--em-space-7);
      display: flex; flex-direction: column; gap: var(--em-space-6); }
    .marco__frase { max-width: 13em; font-size: clamp(2rem, 3.4vw, 2.75rem); }
    .marco__img { margin: auto 0 var(--em-space-6); width: 100%; max-width: 640px; align-self: center;
      border-radius: 24px; box-shadow: 0 10px 40px rgba(43, 31, 110, .10); }
    .marco__principal { flex: 1 1 480px; padding: var(--em-space-6) var(--em-space-7); display: flex; flex-direction: column; }
    .marco__barra { display: flex; justify-content: flex-end; min-height: 44px; margin-bottom: var(--em-space-5); }
    .marco__tarjeta { margin: auto 0; width: 100%; max-width: 32rem; align-self: center; padding: var(--em-space-6); }
    @media (max-width: 760px) {
      .marco__lado { padding: var(--em-space-5); gap: var(--em-space-4); }
      .marco__img { display: none; }
      .marco__principal { padding: var(--em-space-4); }
      .marco__tarjeta { padding: var(--em-space-5); }
    }
  `
})
export class MarcoAuthComponent {
  readonly frase = input.required<string>();
  readonly imagen = input('assets/img/login.webp');
}
