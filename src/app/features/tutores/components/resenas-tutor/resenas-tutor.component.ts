import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Evaluacion } from '../../../../core/models/evaluacion.model';
import { EvaluacionService } from '../../../../core/services/evaluacion.service';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';

/** Reseñas públicas del tutor: distribución de estrellas y comentarios recientes. */
@Component({
  selector: 'app-resenas-tutor',
  standalone: true,
  imports: [TranslateModule, FechaPipe],
  template: `
    <section class="em-card bloque" aria-labelledby="resenas-titulo">
      <h2 id="resenas-titulo" class="bloque__titulo">{{ 'RESENAS.TITULO' | translate }}</h2>
      @if (resenas().length === 0) {
        <p class="em-muted">{{ 'RESENAS.VACIO' | translate }}</p>
      } @else {
        <div class="resenas">
          <ul class="distribucion" [attr.aria-label]="'RESENAS.DISTRIBUCION' | translate">
            @for (fila of distribucion(); track fila.estrellas) {
              <li>
                <span class="distribucion__etiqueta">{{ fila.estrellas }} ★</span>
                <span class="distribucion__barra" aria-hidden="true"><span [style.width.%]="fila.porcentaje"></span></span>
                <span class="distribucion__n">{{ fila.cantidad }}</span>
              </li>
            }
          </ul>
          <ul class="lista">
            @for (r of conComentario(); track r.id) {
              <li class="resena">
                <p class="resena__estrellas">
                  <span aria-hidden="true">{{ '★'.repeat(r.calificacionEstrellas) }}{{ '☆'.repeat(5 - r.calificacionEstrellas) }}</span>
                  <span class="em-sr-only">{{ 'EVALUACION.N_ESTRELLAS' | translate: { n: r.calificacionEstrellas } }}</span>
                  <span class="em-hint">{{ r.fechaEvaluacion | fecha: 'd MMM yyyy' }}</span>
                </p>
                <p class="resena__texto">{{ r.comentario }}</p>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
  styles: `
    .bloque { padding: var(--em-space-5); margin-bottom: var(--em-space-5); }
    .bloque__titulo { font-size: 1.25rem; }
    .resenas { display: flex; flex-wrap: wrap; gap: var(--em-space-6); align-items: flex-start; }
    .distribucion { flex: 1 1 14rem; list-style: none; padding: 0; margin: 0; display: grid; gap: var(--em-space-2); font-size: var(--em-text-xs); }
    .distribucion li { display: grid; grid-template-columns: 2.5rem 1fr 2rem; align-items: center; gap: var(--em-space-2); }
    .distribucion__barra { height: 8px; border-radius: 8px; background: var(--em-surface-2); overflow: hidden; }
    .distribucion__barra span { display: block; height: 100%; background: var(--em-primary); border-radius: inherit; }
    .distribucion__n { color: var(--em-text-2); text-align: right; }
    .lista { flex: 2 1 20rem; list-style: none; padding: 0; margin: 0; display: grid; gap: var(--em-space-3); }
    .resena { padding: var(--em-space-3) var(--em-space-4); border-radius: 14px; background: var(--em-surface-2); }
    .resena__estrellas { display: flex; align-items: baseline; gap: var(--em-space-3); margin: 0 0 var(--em-space-1); color: #B45309; }
    .resena__texto { margin: 0; }
  `
})
export class ResenasTutorComponent implements OnInit {
  private readonly evaluacionService = inject(EvaluacionService);
  readonly tutorId = input.required<number>();
  readonly resenas = signal<Evaluacion[]>([]);

  /** Solo las que tienen comentario, máximo 6. */
  readonly conComentario = computed(() => this.resenas().filter((r) => r.comentario?.trim()).slice(0, 6));

  readonly distribucion = computed(() => {
    const total = this.resenas().length || 1;
    return [5, 4, 3, 2, 1].map((estrellas) => {
      const cantidad = this.resenas().filter((r) => r.calificacionEstrellas === estrellas).length;
      return { estrellas, cantidad, porcentaje: Math.round((cantidad / total) * 100) };
    });
  });

  ngOnInit(): void {
    this.evaluacionService.listarPorTutor(this.tutorId()).subscribe({ next: (lista) => this.resenas.set(lista), error: () => this.resenas.set([]) });
  }
}
