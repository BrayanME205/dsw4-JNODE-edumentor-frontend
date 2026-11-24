import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Materia } from '../../../../core/models/materia.model';
import { MateriaService } from '../../../../core/services/materia.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { MateriaCardComponent } from '../../components/materia-card/materia-card.component';

/** Catálogo público de materias con búsqueda y filtro por carrera (filtrado en el cliente). */
@Component({
  selector: 'app-explorar-materias',
  standalone: true,
  imports: [TranslateModule, MateriaCardComponent, CargandoComponent, AlertaComponent, EstadoVacioComponent],
  templateUrl: './explorar-materias.component.html'
})
export class ExplorarMateriasComponent implements OnInit {
  private readonly materiaService = inject(MateriaService);

  readonly materias = signal<Materia[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly busqueda = signal('');
  readonly carrera = signal<string | null>(null);

  /** Carreras distintas, para los chips de filtro. */
  readonly carreras = computed(() => [...new Set(this.materias().map((m) => m.carrera))].sort());

  readonly filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const carrera = this.carrera();
    return this.materias().filter((m) =>
      (!carrera || m.carrera === carrera) &&
      (!texto || m.codigoMateria.toLowerCase().includes(texto) || m.nombreMateria.toLowerCase().includes(texto)));
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.materiaService.listar().subscribe({
      next: (lista) => {
        this.materias.set(lista);
        this.cargando.set(false);
      },
      error: (err: unknown) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      }
    });
  }

  buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }
}
