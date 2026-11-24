import { Disponibilidad } from '../models/disponibilidad.model';
import { aMinutos, estaLibre, fechaDelBloque, horasDelHorario, lunesDe } from './horario';

describe('utilidades de horario', () => {
  const bloque: Disponibilidad = { id: 1, tutorId: 2, diaSemana: 'MONDAY', horaInicio: '13:00:00', horaFin: '16:00:00', estaActivo: true };

  it('convierte horas a minutos', () => {
    expect(aMinutos('13:30:00')).toBe(810);
  });

  it('marca libre solo la hora completa dentro del bloque', () => {
    expect(estaLibre([bloque], 'MONDAY', 13)).toBeTrue();
    expect(estaLibre([bloque], 'MONDAY', 15)).toBeTrue();
    expect(estaLibre([bloque], 'MONDAY', 16)).toBeFalse();
    expect(estaLibre([bloque], 'TUESDAY', 13)).toBeFalse();
  });

  it('calcula las filas del horario a partir de los bloques', () => {
    expect(horasDelHorario([bloque])).toEqual([13, 14, 15]);
    expect(horasDelHorario([]).length).toBe(10);
  });

  it('encuentra el lunes de la semana y la fecha de una celda', () => {
    const domingo = new Date(2026, 10, 15, 18, 0); // domingo 15 nov 2026
    const lunes = lunesDe(domingo);
    expect(lunes.getDate()).toBe(9);
    expect(fechaDelBloque(lunes, 'WEDNESDAY', 14)).toEqual(new Date(2026, 10, 11, 14, 0));
  });
});
