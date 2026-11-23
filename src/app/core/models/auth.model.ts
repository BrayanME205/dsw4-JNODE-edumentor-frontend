/** Contratos de autenticación (ver docs/openapi.yaml del backend). */
export type Rol = 'ESTUDIANTE' | 'TUTOR' | 'COORDINADOR';

/** Roles que se pueden autoregistrar: el coordinador se crea con los datos semilla. */
export type RolRegistro = Exclude<Rol, 'COORDINADOR'>;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistroRequest {
  carne: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: RolRegistro;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  nombre: string;
  rol: Rol;
}

export interface UsuarioResponse {
  id: number;
  carne: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Rol;
}
