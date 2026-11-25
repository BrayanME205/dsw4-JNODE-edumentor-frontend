import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { Sesion } from '../../../../core/models/sesion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SesionService } from '../../../../core/services/sesion.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { SesionItemComponent } from '../../components/sesion-item/sesion-item.component';

type Filtro = 'pendientes' | 'proximas' | 'historial';

/** Mis tutorías (ESTUDIANTE y TUTOR): pendientes, próximas e historial. */
@Component({
  selector: 'app-mis-tutorias',
  standalone: true,
  imports: [RouterLink, TranslateModule, AlertaComponent, CargandoComponent, EncabezadoPaginaComponent, EstadoVacioComponent, SesionItemComponent],
  templateUrl: './mis-tutorias.component.html'
})
export class MisTutoriasComponent implements OnInit {
  private readonly sesionService = inject(SesionService);
  readonly esTutor = inject(AuthService).rol() === 'TUTOR';

  readonly sesiones = signal<Sesion[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly filtro = signal<Filtro>(this.esTutor ? 'pendientes' : 'proximas');

  /** El estudiante ve sus solicitudes dentro de "próximas"; el tutor las ve aparte para responderlas. */
  readonly filtros: Filtro[] = this.esTutor ? ['pendientes', 'proximas', 'historial'] : ['proximas', 'historial'];

  readonly grupos = computed<Record<Filtro, Sesion[]>>(() => {
    const todas = this.sesiones();
    const ascendente = (a: Sesion, b: Sesion) => a.fechaHora.localeCompare(b.fechaHora);
    const proximasEstados = this.esTutor ? ['CONFIRMED', 'IN_SESSION'] : ['REQUESTED', 'CONFIRMED', 'IN_SESSION'];
    return {
      pendientes: todas.filter((s) => s.estado === 'REQUESTED').sort(ascendente),
      proximas: todas.filter((s) => proximasEstados.includes(s.estado)).sort(ascendente),
      // El backend ya las manda de la más reciente a la más antigua
      historial: todas.filter((s) => ['COMPLETED', 'REVIEWED', 'REJECTED', 'CANCELLED'].includes(s.estado))
    };
  });

  readonly visibles = computed(() => this.grupos()[this.filtro()]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.error.set('');
    this.sesionService.mias().subscribe({
      next: (lista) => {
        this.sesiones.set(lista);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }
}
