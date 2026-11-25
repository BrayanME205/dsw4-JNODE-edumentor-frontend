import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { EstadoBadgeComponent } from '../../../../shared/components/estado-badge/estado-badge.component';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';
import { AccionesSesionComponent } from '../acciones-sesion/acciones-sesion.component';

/** Una tutoría en una lista: con quién, qué materia, cuándo, estado y acciones. */
@Component({
  selector: 'app-sesion-item',
  standalone: true,
  imports: [RouterLink, TranslateModule, AvatarComponent, EstadoBadgeComponent, FechaPipe, AccionesSesionComponent],
  template: `
    <article class="em-card item">
      <div class="item__fecha" aria-hidden="true">
        <span class="item__dia">{{ sesion().fechaHora | fecha: 'd' }}</span>
        <span class="item__mes">{{ sesion().fechaHora | fecha: 'MMM' }}</span>
      </div>
      <div class="item__info">
        <div class="em-cluster" style="gap: var(--em-space-2)">
          <span class="item__codigo">{{ sesion().materiaCodigo }}</span>
          <app-estado-badge [estado]="sesion().estado" />
        </div>
        <h3 class="item__titulo">
          <a [routerLink]="['/app/tutorias', sesion().id]">{{ sesion().materiaNombre }}</a>
        </h3>
        <p class="em-muted item__meta">
          {{ sesion().fechaHora | fecha: 'EEEE d MMM, HH:mm' }} · {{ sesion().duracionMinutos }} {{ 'COMUN.MIN' | translate }} ·
          {{ 'MODALIDAD.' + sesion().modalidad | translate }}
        </p>
        <p class="item__persona">
          <app-avatar [nombre]="contraparte()" />
          <span><span class="em-muted">{{ etiquetaContraparte() | translate }}</span> {{ contraparte() }}</span>
        </p>
      </div>
      <app-acciones-sesion class="item__acciones" [sesion]="sesion()" (cambio)="cambio.emit()" />
    </article>
  `,
  styles: `
    .item { display: flex; flex-wrap: wrap; gap: var(--em-space-4); align-items: center; padding: var(--em-space-4) var(--em-space-5); }
    .item__fecha { display: grid; place-items: center; width: 3.75rem; height: 3.75rem; border-radius: 16px; background: var(--em-lavender); color: var(--em-indigo); line-height: 1.1; }
    .item__dia { font-size: 1.375rem; font-weight: 700; }
    .item__mes { font-size: .75rem; text-transform: uppercase; font-weight: 600; }
    .item__info { flex: 1 1 18rem; min-width: 0; }
    .item__codigo { font-size: .8125rem; font-weight: 700; color: var(--em-indigo); }
    .item__titulo { font-size: 1.0625rem; margin: var(--em-space-1) 0; }
    .item__titulo a { color: var(--em-text); }
    .item__meta { font-size: var(--em-text-xs); margin: 0 0 var(--em-space-2); }
    .item__persona { display: flex; align-items: center; gap: var(--em-space-2); margin: 0; font-size: var(--em-text-xs); }
    .item__acciones { flex: 0 0 auto; }
  `
})
export class SesionItemComponent {
  private readonly auth = inject(AuthService);
  readonly sesion = input.required<Sesion>();
  readonly cambio = output<void>();

  /** El estudiante ve al tutor; el tutor ve al estudiante. */
  readonly contraparte = computed(() => (this.auth.rol() === 'TUTOR' ? this.sesion().estudianteNombre : this.sesion().tutorNombre));
  readonly etiquetaContraparte = computed(() => (this.auth.rol() === 'TUTOR' ? 'TUTORIAS.CON_ESTUDIANTE' : 'TUTORIAS.CON_TUTOR'));
}
