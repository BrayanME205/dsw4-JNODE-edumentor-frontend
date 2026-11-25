import { Component, computed, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DiaSemana, Disponibilidad } from '../../../core/models/disponibilidad.model';
import { DIAS, claveBloque, estaLibre, fechaDelBloque, horasDelHorario } from '../../../core/utils/horario';
import { FechaPipe } from '../../pipes/fecha.pipe';

export interface BloqueElegido {
  dia: DiaSemana;
  hora: number;
}

type EstadoCelda = 'libre' | 'ocupado' | 'elegido' | '';

/**
 * Elemento firma 2: matriz días × horas.
 * - Solo lectura (perfil del tutor, mi disponibilidad): muestra los bloques libres.
 * - Seleccionable (reservar): cada bloque libre es un botón; emite (elegir).
 * Si recibe `lunes`, muestra la fecha de cada día y desactiva las horas que ya pasaron.
 */
@Component({
  selector: 'app-horario-semanal',
  standalone: true,
  imports: [TranslateModule, FechaPipe],
  templateUrl: './horario-semanal.component.html',
  styleUrl: './horario-semanal.component.css'
})
export class HorarioSemanalComponent {
  readonly disponibilidades = input.required<Disponibilidad[]>();
  readonly titulo = input('');
  readonly lunes = input<Date | null>(null);
  /** Claves "DIA-HORA" que ya están tomadas (por ejemplo, tutorías propias). */
  readonly ocupados = input<string[]>([]);
  readonly seleccionable = input(false);
  readonly elegido = input<string | null>(null);
  readonly elegir = output<BloqueElegido>();

  readonly dias = DIAS;
  readonly horas = computed(() => horasDelHorario(this.disponibilidades()));

  estado(dia: DiaSemana, hora: number): EstadoCelda {
    const clave = claveBloque(dia, hora);
    if (clave === this.elegido()) return 'elegido';
    if (this.ocupados().includes(clave)) return 'ocupado';
    if (!estaLibre(this.disponibilidades(), dia, hora) || this.yaPaso(dia, hora)) return '';
    return 'libre';
  }

  fecha(dia: DiaSemana, hora = 0): Date | null {
    const lunes = this.lunes();
    return lunes ? fechaDelBloque(lunes, dia, hora) : null;
  }

  etiquetaHora(hora: number): string {
    return `${String(hora).padStart(2, '0')}:00`;
  }

  private yaPaso(dia: DiaSemana, hora: number): boolean {
    const fecha = this.fecha(dia, hora);
    return fecha !== null && fecha.getTime() <= Date.now();
  }
}
