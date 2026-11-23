import { Component, computed, input } from '@angular/core';

/** Íconos de trazo propios (sin librería). Siempre decorativos: el texto va al lado. */
const TRAZOS: Record<string, string> = {
  inicio: 'M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z',
  reservar: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 3v4M16 3v4M4 10h16M12 13v4M10 15h4',
  tutorias: 'M4 12h16M6 12a2 2 0 1 0 0 .01M12 12a2 2 0 1 0 0 .01M18 12a2 2 0 1 0 0 .01',
  materias: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h10',
  tutores: 'M9 8a3 3 0 1 0 0 .01M3 20c.8-3 3.2-5 6-5s5.2 2 6 5M17 11a2.5 2.5 0 1 0 0 .01M16 15c2.5 0 4.3 1.6 5 4',
  disponibilidad: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  supervision: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  salir: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4'
};

@Component({
  selector: 'app-icono',
  standalone: true,
  template: `
    <svg [attr.width]="tamano()" [attr.height]="tamano()" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path [attr.d]="trazo()" />
    </svg>
  `,
  styles: `:host { display: inline-flex; }`
})
export class IconoComponent {
  readonly nombre = input.required<string>();
  readonly tamano = input(22);
  readonly trazo = computed(() => TRAZOS[this.nombre()] ?? '');
}
