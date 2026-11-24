import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Disponibilidad, DisponibilidadRequest } from '../models/disponibilidad.model';

/** Horario semanal de los tutores. Consultar es público; modificar es del TUTOR dueño del bloque. */
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/disponibilidades`;

  /** Solo devuelve los bloques activos, ordenados por día y hora. */
  listarPorTutor(tutorId: number): Observable<Disponibilidad[]> {
    return this.http.get<Disponibilidad[]>(this.url, { params: { tutorId } });
  }

  crear(datos: DisponibilidadRequest): Observable<Disponibilidad> {
    return this.http.post<Disponibilidad>(this.url, datos);
  }

  actualizar(id: number, datos: DisponibilidadRequest): Observable<Disponibilidad> {
    return this.http.put<Disponibilidad>(`${this.url}/${id}`, datos);
  }

  /** El backend no borra el bloque: lo marca como inactivo. */
  desactivar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
