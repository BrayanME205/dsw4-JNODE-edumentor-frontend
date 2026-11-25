import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Tutor } from '../models/tutor.model';

/** Acceso público a /api/tutores. */
@Injectable({ providedIn: 'root' })
export class TutorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/tutores`;

  listar(): Observable<Tutor[]> {
    return this.http.get<Tutor[]>(this.url);
  }

  obtener(id: number): Observable<Tutor> {
    return this.http.get<Tutor>(`${this.url}/${id}`);
  }
}
