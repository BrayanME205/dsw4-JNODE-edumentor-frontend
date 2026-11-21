import { Component, input } from '@angular/core';

/** Estado vacío: una invitación a actuar. El botón o enlace se pasa como contenido. */
@Component({
  selector: 'app-estado-vacio',
  standalone: true,
  template: `
    <div class="vacio">
      @if (imagen()) {
        <img [src]="imagen()" alt="" class="vacio__img">
      }
      <div class="vacio__texto">
        <h2 class="em-titulo-seccion vacio__titulo">{{ titulo() }}</h2>
        <p class="em-muted">{{ texto() }}</p>
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .vacio { display: flex; flex-wrap: wrap; align-items: center; gap: var(--em-space-5); padding: var(--em-space-5);
      border-radius: 24px; background: #F4EFFC; }
    .vacio__img { flex: 0 1 260px; width: 100%; max-width: 260px; border-radius: 18px; }
    .vacio__texto { flex: 1 1 280px; }
    .vacio__titulo { font-size: var(--em-text-lg); margin-bottom: var(--em-space-2); }
  `
})
export class EstadoVacioComponent {
  readonly titulo = input.required<string>();
  readonly texto = input('');
  readonly imagen = input('');
}
