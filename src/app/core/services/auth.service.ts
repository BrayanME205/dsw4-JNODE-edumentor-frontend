import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegistroRequest, Rol, UsuarioResponse } from '../models/auth.model';

const CLAVE_TOKEN = 'edumentor_token';
const CLAVE_USUARIO = 'edumentor_usuario';

/**
 * Maneja la sesión: login, registro, logout y el usuario actual.
 * El token se guarda en localStorage y el usuario en una signal para que la interfaz reaccione.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/auth`;

  readonly usuario = signal<AuthResponse | null>(this.leerSesionGuardada());
  readonly autenticado = computed(() => this.usuario() !== null);
  readonly rol = computed<Rol | null>(() => this.usuario()?.rol ?? null);

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, datos).pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  registrar(datos: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.url}/register`, datos);
  }

  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.usuario.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  tieneRol(...roles: Rol[]): boolean {
    const rol = this.rol();
    return rol !== null && roles.includes(rol);
  }

  /** Pantalla de inicio según el rol del usuario autenticado. */
  rutaInicio(): string {
    switch (this.rol()) {
      case 'ESTUDIANTE':
        return '/app/estudiante';
      case 'TUTOR':
        return '/app/tutor';
      case 'COORDINADOR':
        return '/app/coordinacion';
      default:
        return '/login';
    }
  }

  private guardarSesion(respuesta: AuthResponse): void {
    localStorage.setItem(CLAVE_TOKEN, respuesta.token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta));
    this.usuario.set(respuesta);
  }

  private leerSesionGuardada(): AuthResponse | null {
    try {
      const guardado = localStorage.getItem(CLAVE_USUARIO);
      return guardado && localStorage.getItem(CLAVE_TOKEN) ? (JSON.parse(guardado) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
