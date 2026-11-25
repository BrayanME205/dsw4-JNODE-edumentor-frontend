import { Sesion } from '../models/sesion.model';
import { aFechaLocal, accionesDisponibles, aTiempoDeCancelar, claseEstado } from './sesion-reglas';

function sesion(parcial: Partial<Sesion>): Sesion {
  return {
    id: 1, estudianteId: 1, estudianteNombre: 'Ana', tutorId: 2, tutorNombre: 'Luis', materiaId: 3,
    materiaCodigo: 'IF3001', materiaNombre: 'Algoritmos', fechaHora: '2026-11-25T15:00:00', fechaHoraFin: '2026-11-25T16:00:00',
    duracionMinutos: 60, estado: 'REQUESTED', modalidad: 'VIRTUAL', resumenTrabajo: null, ...parcial
  };
}

describe('reglas de sesión', () => {
  const antes = new Date(2026, 10, 25, 10, 0); // 5 h antes
  const casiHora = new Date(2026, 10, 25, 14, 0); // 1 h antes
  const despues = new Date(2026, 10, 25, 15, 5);

  it('el tutor acepta o rechaza una solicitud', () => {
    expect(accionesDisponibles(sesion({}), 'TUTOR', antes)).toEqual(['aceptar', 'rechazar']);
  });

  it('el tutor solo inicia cuando llegó la hora', () => {
    expect(accionesDisponibles(sesion({ estado: 'CONFIRMED' }), 'TUTOR', antes)).toEqual(['cancelar']);
    expect(accionesDisponibles(sesion({ estado: 'CONFIRMED' }), 'TUTOR', despues)).toEqual(['iniciar']);
  });

  it('no se puede cancelar con menos de 2 horas', () => {
    expect(aTiempoDeCancelar(sesion({ estado: 'CONFIRMED' }), casiHora)).toBeFalse();
    expect(accionesDisponibles(sesion({ estado: 'CONFIRMED' }), 'ESTUDIANTE', casiHora)).toEqual([]);
  });

  it('el estudiante evalúa una sesión completada y el coordinador no actúa', () => {
    expect(accionesDisponibles(sesion({ estado: 'COMPLETED' }), 'ESTUDIANTE', despues)).toEqual(['evaluar']);
    expect(accionesDisponibles(sesion({}), 'COORDINADOR', antes)).toEqual([]);
  });

  it('formatea la fecha en hora local y asigna la clase del estado', () => {
    expect(aFechaLocal(new Date(2026, 10, 5, 9, 30))).toBe('2026-11-05T09:30:00');
    expect(claseEstado('IN_SESSION')).toBe('en-sesion');
    expect(claseEstado('CANCELLED')).toBe('cerrada');
  });
});
