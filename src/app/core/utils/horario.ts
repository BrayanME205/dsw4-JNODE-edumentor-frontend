import { DiaSemana, Disponibilidad } from '../models/disponibilidad.model';

/** Días que se muestran en el horario (la universidad no da tutorías en domingo). */
export const DIAS: DiaSemana[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

/** "13:30:00" → 810 minutos desde la medianoche. */
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

/** Filas del horario: de la hora más temprana a la más tardía de los bloques (por defecto 8 a 17). */
export function horasDelHorario(bloques: Disponibilidad[]): number[] {
  const inicio = bloques.length ? Math.min(...bloques.map((b) => Math.floor(aMinutos(b.horaInicio) / 60))) : 8;
  const fin = bloques.length ? Math.max(...bloques.map((b) => Math.ceil(aMinutos(b.horaFin) / 60))) : 18;
  const horas: number[] = [];
  for (let h = inicio; h < fin; h++) {
    horas.push(h);
  }
  return horas;
}

/** ¿La hora completa [hora, hora+1) cae dentro de algún bloque de ese día? */
export function estaLibre(bloques: Disponibilidad[], dia: DiaSemana, hora: number): boolean {
  const desde = hora * 60;
  return bloques.some((b) => b.diaSemana === dia && aMinutos(b.horaInicio) <= desde && desde + 60 <= aMinutos(b.horaFin));
}

/** Clave única de una celda, por ejemplo "MONDAY-14". */
export function claveBloque(dia: DiaSemana, hora: number): string {
  return `${dia}-${hora}`;
}

/** Lunes (00:00) de la semana que contiene la fecha. */
export function lunesDe(fecha: Date): Date {
  const lunes = new Date(fecha);
  const desplazamiento = (lunes.getDay() + 6) % 7; // getDay(): domingo = 0
  lunes.setDate(lunes.getDate() - desplazamiento);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

/** Fecha y hora concretas de una celda dentro de la semana que empieza en `lunes`. */
export function fechaDelBloque(lunes: Date, dia: DiaSemana, hora: number): Date {
  const fecha = new Date(lunes);
  fecha.setDate(lunes.getDate() + DIAS.indexOf(dia));
  fecha.setHours(hora, 0, 0, 0);
  return fecha;
}
