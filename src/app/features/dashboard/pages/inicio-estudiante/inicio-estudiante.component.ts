import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { ACTIVOS } from '../../../../core/utils/sesion-reglas';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { SesionItemComponent } from '../../../tutorias/components/sesion-item/sesion-item.component';

/** Inicio del ESTUDIANTE: próxima tutoría, pendientes de evaluar y accesos rápidos. */
@Component({
  selector: 'app-inicio-estudiante',
  standalone: true,
  imports: [RouterLink, TranslateModule, CargandoComponent, EstadoVacioComponent, SesionItemComponent],
  templateUrl: './inicio-estudiante.component.html'
})
export class InicioEstudianteComponent implements OnInit {
  private readonly sesionService = inject(SesionService);
  readonly usuario = inject(AuthService).usuario;

  readonly sesiones = signal<Sesion[]>([]);
  readonly cargando = signal(true);

  readonly proximas = computed(() =>
    this.sesiones()
      .filter((s) => ACTIVOS.includes(s.estado))
      .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora))
      .slice(0, 3)
  );
  readonly porEvaluar = computed(() => this.sesiones().filter((s) => s.estado === 'COMPLETED'));
  readonly completadas = computed(() => this.sesiones().filter((s) => s.estado === 'COMPLETED' || s.estado === 'REVIEWED').length);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.sesionService.mias().subscribe({
      next: (lista) => {
        this.sesiones.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
