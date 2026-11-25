/** Días tal como los envía Java (java.time.DayOfWeek). */
export type DiaSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

/** Bloque semanal de disponibilidad de un tutor (DisponibilidadResponse). */
export interface Disponibilidad {
  id: number;
  tutorId: number;
  diaSemana: DiaSemana;
  /** "HH:mm:ss" */
  horaInicio: string;
  horaFin: string;
  estaActivo: boolean;
}

/** Cuerpo para crear o editar: el tutor sale del token, no se envía. */
export interface DisponibilidadRequest {
  diaSemana: DiaSemana;
  /** "HH:mm" */
  horaInicio: string;
  horaFin: string;
}
