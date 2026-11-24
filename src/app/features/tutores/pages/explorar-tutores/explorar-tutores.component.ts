import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { DiaSemana } from '../../../../core/models/disponibilidad.model';
import { Tutor } from '../../../../core/models/tutor.model';
import { DisponibilidadService } from '../../../../core/services/disponibilidad.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { DIAS } from '../../../../core/utils/horario';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { TutorCardComponent } from '../../components/tutor-card/tutor-card.component';

type Orden = 'calificacion' | 'nombre';

/** Catálogo público de tutores con búsqueda, filtro por día y orden. */
@Component({
  selector: 'app-explorar-tutores',
  standalone: true,
  imports: [TranslateModule, AlertaComponent, CargandoComponent, EstadoVacioComponent, TutorCardComponent],
  templateUrl: './explorar-tutores.component.html'
})
export class ExplorarTutoresComponent implements OnInit {
  private readonly tutorService = inject(TutorService);
  private readonly disponibilidadService = inject(DisponibilidadService);

  readonly dias = DIAS;
  readonly tutores = signal<Tutor[]>([]);
  /** Días que atiende cada tutor: { tutorId: ['MONDAY', ...] } */
  readonly diasPorTutor = signal<Record<number, DiaSemana[]>>({});
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly busqueda = signal('');
  readonly dia = signal<DiaSemana | null>(null);
  readonly orden = signal<Orden>('calificacion');

  readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const dia = this.dia();
    const lista = this.tutores().filter((t) => {
      const coincideNombre = `${t.nombre} ${t.apellido}`.toLowerCase().includes(texto);
      const coincideDia = !dia || (this.diasPorTutor()[t.id] ?? []).includes(dia);
      return coincideNombre && coincideDia;
    });
    return this.orden() === 'nombre'
      ? lista.sort((a, b) => a.nombre.localeCompare(b.nombre))
      : lista.sort((a, b) => b.promedioCalificacion - a.promedioCalificacion);
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.tutorService
      .listar()
      .pipe(
        // Por cada tutor pedimos su horario; si uno falla, ese tutor queda sin días
        switchMap((tutores) => {
          this.tutores.set(tutores);
          const pedidos = tutores.map((t) =>
            this.disponibilidadService.listarPorTutor(t.id).pipe(
              map((bloques): [number, DiaSemana[]] => [t.id, [...new Set(bloques.map((b) => b.diaSemana))]]),
              catchError(() => of<[number, DiaSemana[]]>([t.id, []]))
            )
          );
          return pedidos.length ? forkJoin(pedidos) : of<[number, DiaSemana[]][]>([]);
        })
      )
      .subscribe({
        next: (pares) => {
          const dias: Record<number, DiaSemana[]> = {};
          pares.forEach(([id, lista]) => (dias[id] = lista));
          this.diasPorTutor.set(dias);
          this.cargando.set(false);
        },
        error: (err: unknown) => {
          this.error.set(mensajeDeError(err));
          this.cargando.set(false);
        }
      });
  }

  /** Días de un tutor; si su horario no cargó, lista vacía. */
  diasDe(tutorId: number): DiaSemana[] {
    return this.diasPorTutor()[tutorId] ?? [];
  }

  buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }

  ordenar(evento: Event): void {
    this.orden.set((evento.target as HTMLSelectElement).value as Orden);
  }
}
