import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Tutor } from '../../../../core/models/tutor.model';
import { TutorService } from '../../../../core/services/tutor.service';
import { TutorCardComponent } from '../tutor-card/tutor-card.component';

/** Sección de la landing con los 4 tutores mejor calificados. */
@Component({
  selector: 'app-tutores-destacados',
  standalone: true,
  imports: [RouterLink, TranslateModule, TutorCardComponent],
  template: `
    @if (tutores().length > 0) {
      <section class="em-container seccion" aria-labelledby="tutores-titulo">
        <div class="seccion__cabecera">
          <h2 id="tutores-titulo" class="em-titulo-seccion seccion__titulo">{{ 'TUTORES.DESTACADOS' | translate }}</h2>
          <a routerLink="/tutores">{{ 'TUTORES.VER_TODOS' | translate }}</a>
        </div>
        <div class="em-grid">
          @for (tutor of tutores(); track tutor.id) {
            <app-tutor-card [tutor]="tutor" />
          }
        </div>
      </section>
    }
  `,
  styles: `
    .seccion { padding-block: var(--em-space-6); }
    .seccion__cabecera { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--em-space-3); margin-bottom: var(--em-space-5); }
    .seccion__titulo { font-size: 2.25rem; margin: 0; }
  `
})
export class TutoresDestacadosComponent implements OnInit {
  private readonly tutorService = inject(TutorService);
  readonly tutores = signal<Tutor[]>([]);

  ngOnInit(): void {
    this.tutorService.listar().subscribe({
      next: (lista) => this.tutores.set([...lista].sort((a, b) => b.promedioCalificacion - a.promedioCalificacion).slice(0, 4)),
      error: () => this.tutores.set([])
    });
  }
}
