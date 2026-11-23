import { Component, input } from '@angular/core';

/** Título (h1) y bajada de cada pantalla de la app; las acciones se pasan como contenido. */
@Component({
  selector: 'app-encabezado-pagina',
  standalone: true,
  template: `
    <header class="encabezado">
      <div class="encabezado__texto">
        <h1 class="em-titulo-pantalla">{{ titulo() }}</h1>
        @if (subtitulo()) {
          <p class="em-muted encabezado__sub">{{ subtitulo() }}</p>
        }
      </div>
      <div class="em-cluster"><ng-content /></div>
    </header>
  `,
  styles: `
    .encabezado { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--em-space-4); margin-bottom: var(--em-space-6); }
    .encabezado__texto { flex: 1 1 260px; }
    .encabezado__sub { margin: 0; }
  `
})
export class EncabezadoPaginaComponent {
  readonly titulo = input.required<string>();
  readonly subtitulo = input('');
}
