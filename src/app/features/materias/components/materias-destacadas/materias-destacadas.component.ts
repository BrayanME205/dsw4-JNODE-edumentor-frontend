import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Materia } from '../../../../core/models/materia.model';
import { MateriaService } from '../../../../core/services/materia.service';
import { MateriaCardComponent } from '../materia-card/materia-card.component';

/** Sección de la landing con las primeras materias del catálogo. */
@Component({
  selector: 'app-materias-destacadas',
  standalone: true,
  imports: [RouterLink, TranslateModule, MateriaCardComponent],
  template: `
    @if (materias().length > 0) {
      <section class="em-container seccion" aria-labelledby="materias-titulo">
        <div class="seccion__cabecera">
          <h2 id="materias-titulo" class="em-titulo-seccion seccion__titulo">{{ 'MATERIAS.EXPLORA' | translate }}</h2>
          <a routerLink="/materias">{{ 'MATERIAS.VER_CATALOGO' | translate }}</a>
        </div>
        <div class="seccion__grid">
          @for (materia of materias(); track materia.id) {
            <app-materia-card [materia]="materia" [conEnlace]="false" />
          }
        </div>
      </section>
    }
  `,
  styles: `
    .seccion { padding-block: var(--em-space-6); }
    .seccion__cabecera { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: var(--em-space-3); margin-bottom: var(--em-space-5); }
    .seccion__titulo { font-size: 2.25rem; margin: 0; }
    .seccion__grid { display: grid; gap: var(--em-space-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 12.5rem), 1fr)); }
  `
})
export class MateriasDestacadasComponent implements OnInit {
  private readonly materiaService = inject(MateriaService);
  readonly materias = signal<Materia[]>([]);

  ngOnInit(): void {
    // Si la API no responde, la sección simplemente no se muestra
    this.materiaService.listar().subscribe({ next: (lista) => this.materias.set(lista.slice(0, 5)), error: () => this.materias.set([]) });
  }
}
