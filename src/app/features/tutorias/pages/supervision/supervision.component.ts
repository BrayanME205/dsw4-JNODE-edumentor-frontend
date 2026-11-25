import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EstadoTutoria, Sesion } from '../../../../core/models/sesion.model';
import { SesionService } from '../../../../core/services/sesion.service';
import { mensajeDeError } from '../../../../core/utils/errores';
import { AlertaComponent } from '../../../../shared/components/alerta/alerta.component';
import { CargandoComponent } from '../../../../shared/components/cargando/cargando.component';
import { EncabezadoPaginaComponent } from '../../../../shared/components/encabezado-pagina/encabezado-pagina.component';
import { EstadoBadgeComponent } from '../../../../shared/components/estado-badge/estado-badge.component';
import { FechaPipe } from '../../../../shared/pipes/fecha.pipe';

/** COORDINADOR: todas las tutorías del programa, con conteo por estado, filtro y búsqueda. */
@Component({
  selector: 'app-supervision',
  standalone: true,
  imports: [RouterLink, TranslateModule, AlertaComponent, CargandoComponent, EncabezadoPaginaComponent, EstadoBadgeComponent, FechaPipe],
  templateUrl: './supervision.component.html',
  styles: `
    .conteos { display: grid; gap: var(--em-space-3); grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr)); margin-bottom: var(--em-space-5); }
    .conteo { padding: var(--em-space-3) var(--em-space-4); text-align: left; cursor: pointer; font: inherit; color: inherit;
      border: 1.5px solid var(--em-border); border-radius: 14px; background: var(--em-surface); }
    .conteo[aria-pressed="true"] { border-color: var(--em-primary); box-shadow: 0 0 0 3px var(--em-lavender); }
    .conteo strong { display: block; font-size: 1.5rem; margin-top: var(--em-space-1); }
    .tabla { overflow-x: auto; }
    .tabla table { min-width: 48rem; }
  `
})
export class SupervisionComponent implements OnInit {
  private readonly sesionService = inject(SesionService);

  readonly estados: EstadoTutoria[] = ['REQUESTED', 'CONFIRMED', 'IN_SESSION', 'COMPLETED', 'REVIEWED', 'REJECTED', 'CANCELLED'];
  readonly sesiones = signal<Sesion[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly estado = signal<EstadoTutoria | null>(null);
  readonly busqueda = signal('');

  readonly conteos = computed(() => {
    const conteo = {} as Record<EstadoTutoria, number>;
    this.estados.forEach((e) => (conteo[e] = this.sesiones().filter((s) => s.estado === e).length));
    return conteo;
  });

  readonly filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return this.sesiones().filter((s) => {
      const coincideEstado = !this.estado() || s.estado === this.estado();
      const coincideTexto = `${s.estudianteNombre} ${s.tutorNombre} ${s.materiaCodigo} ${s.materiaNombre}`.toLowerCase().includes(texto);
      return coincideEstado && coincideTexto;
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    // Para el coordinador, /sesiones/mias devuelve todas
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

  alternarEstado(estado: EstadoTutoria): void {
    this.estado.set(this.estado() === estado ? null : estado);
  }

  buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }
}
