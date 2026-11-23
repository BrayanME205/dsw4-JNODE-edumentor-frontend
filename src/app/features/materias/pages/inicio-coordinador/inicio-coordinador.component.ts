import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Materia } from '../../../../core/models/materia.model';
import { AuthService } from '../../../../core/services/auth.service';
import { MateriaService } from '../../../../core/services/materia.service';

/** Inicio del COORDINADOR: resumen del catálogo y accesos rápidos. */
@Component({
  selector: 'app-inicio-coordinador',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="em-banner em-escena">
      <span class="em-burbuja em-burbuja--magenta" style="width: 170px; height: 170px; left: 38%; bottom: -90px" aria-hidden="true"></span>
      <span class="em-burbuja em-burbuja--violeta" style="width: 130px; height: 130px; left: -40px; top: -50px" aria-hidden="true"></span>
      <div class="em-glass em-banner__texto">
        <h1 class="em-titulo-seccion" style="font-size: 1.75rem">{{ 'COORDINACION.HOLA' | translate: { nombre: usuario()?.nombre } }}</h1>
        <p class="em-muted">{{ 'COORDINACION.SUBTITULO' | translate }}</p>
        <dl class="resumen">
          <div><dt>{{ 'COORDINACION.MATERIAS' | translate }}</dt><dd>{{ materias().length }}</dd></div>
          <div><dt>{{ 'COORDINACION.CARRERAS' | translate }}</dt><dd>{{ carreras() }}</dd></div>
        </dl>
      </div>
      <img src="assets/img/checklist.webp" alt="" class="em-banner__img">
    </section>

    <h2 style="font-size: 1.25rem">{{ 'COORDINACION.ACCESOS' | translate }}</h2>
    <div class="accesos">
      <a routerLink="/app/materias" class="acceso"><strong>{{ 'COORDINACION.ACCESO_MATERIAS' | translate }} →</strong><span class="em-muted">{{ 'COORDINACION.ACCESO_MATERIAS_TEXTO' | translate }}</span></a>
      <a routerLink="/app/supervision" class="acceso"><strong>{{ 'COORDINACION.ACCESO_SUPERVISION' | translate }} →</strong><span class="em-muted">{{ 'COORDINACION.ACCESO_SUPERVISION_TEXTO' | translate }}</span></a>
      <a routerLink="/tutores" class="acceso"><strong>{{ 'COORDINACION.ACCESO_TUTORES' | translate }} →</strong><span class="em-muted">{{ 'COORDINACION.ACCESO_TUTORES_TEXTO' | translate }}</span></a>
    </div>
  `,
  styles: `
    .resumen { display: flex; flex-wrap: wrap; gap: var(--em-space-3) var(--em-space-6); margin: var(--em-space-4) 0 0; }
    .resumen dt { font-size: .8125rem; color: var(--em-text-2); }
    .resumen dd { margin: 0; font-size: 1.375rem; font-weight: 700; }
    .accesos { display: grid; gap: var(--em-space-3); grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); }
    .acceso { display: flex; flex-direction: column; gap: var(--em-space-1); padding: var(--em-space-4) var(--em-space-5);
      border: 1.5px solid var(--em-border); border-radius: 14px; background: var(--em-surface); text-decoration: none; color: var(--em-text); }
    .acceso strong { color: var(--em-violet-hover); }
    .acceso:hover { border-color: var(--em-primary); }
  `
})
export class InicioCoordinadorComponent implements OnInit {
  private readonly materiaService = inject(MateriaService);
  readonly usuario = inject(AuthService).usuario;
  readonly materias = signal<Materia[]>([]);
  readonly carreras = computed(() => new Set(this.materias().map((m) => m.carrera)).size);

  ngOnInit(): void {
    this.materiaService.listar().subscribe({ next: (lista) => this.materias.set(lista), error: () => this.materias.set([]) });
  }
}
