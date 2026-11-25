import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Evaluacion, EvaluacionRequest } from '../models/evaluacion.model';

/** Evaluaciones de las tutorías y reseñas públicas de los tutores. */
@Injectable({ providedIn: 'root' })
export class EvaluacionService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  /** ESTUDIANTE, sesión COMPLETED. 409 si ya fue evaluada. La sesión pasa a REVIEWED. */
  registrar(sesionId: number, datos: EvaluacionRequest): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.api}/sesiones/${sesionId}/evaluacion`, datos);
  }

  obtener(sesionId: number): Observable<Evaluacion> {
    return this.http.get<Evaluacion>(`${this.api}/sesiones/${sesionId}/evaluacion`);
  }

  /** Público: reseñas para el perfil del tutor, de la más reciente a la más antigua. */
  listarPorTutor(tutorId: number): Observable<Evaluacion[]> {
    return this.http.get<Evaluacion[]>(`${this.api}/tutores/${tutorId}/evaluaciones`);
  }
}
