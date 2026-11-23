import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let servicio: AuthService;
  let http: HttpTestingController;

  const respuesta: AuthResponse = { token: 'jwt-de-prueba', tipo: 'Bearer', usuarioId: 4, nombre: 'Ana', rol: 'ESTUDIANTE' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('el login guarda el token y el usuario', () => {
    servicio.login({ email: 'estudiante1@ucr.ac.cr', password: 'Test1234!' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush(respuesta);

    expect(servicio.token).toBe('jwt-de-prueba');
    expect(servicio.autenticado()).toBeTrue();
    expect(servicio.rutaInicio()).toBe('/app/estudiante');
  });

  it('el logout elimina el token y la sesión', () => {
    servicio.login({ email: 'estudiante1@ucr.ac.cr', password: 'Test1234!' }).subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush(respuesta);

    servicio.logout();

    expect(servicio.token).toBeNull();
    expect(servicio.autenticado()).toBeFalse();
  });
});
