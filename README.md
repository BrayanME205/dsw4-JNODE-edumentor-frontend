# EduMentor Hub — Frontend

SPA en **Angular 18 (componentes standalone + signals)** para la plataforma de tutorías entre pares.
Proyecto Integrador IF0009 Desarrollo de Software IV — UCR, Sede del Caribe (Paraíso), II Ciclo 2026.

Backend: repositorio `dsw4-JNODE-edumentor-backend` (Spring Boot 3, `http://localhost:8080/api`).

## Requisitos
- Node.js 20 o superior y npm 10
- Backend en ejecución en `http://localhost:8080` (ver su README)

## Ejecución local
```bash
npm install        # incluye @ngx-translate/core 15 y @ngx-translate/http-loader 8
npm start          # http://localhost:4200
npm test           # pruebas unitarias (Karma + Jasmine)
npm run build      # build de producción en dist/
```
La URL de la API está en `src/environments/environment.ts` (`apiUrl`).

## Credenciales de prueba
Las crea el backend al arrancar. Contraseña común: **`Test1234!`**

| Rol | Correo | Qué probar |
|-----|--------|------------|
| ESTUDIANTE | estudiante1@ucr.ac.cr | Reservar, cancelar, evaluar la sesión completada, agregar recursos |
| ESTUDIANTE | estudiante2@ucr.ac.cr | Tiene una solicitud pendiente con Luis |
| TUTOR | tutor1@ucr.ac.cr | Aceptar/rechazar, iniciar, finalizar con resumen, mi disponibilidad |
| TUTOR | tutor2@ucr.ac.cr | Horario de lunes, miércoles y sábado |
| COORDINADOR | coordinador@ucr.ac.cr | Administrar materias y supervisar todas las tutorías |

## Pantallas por rol
| Ruta | Pantalla | Acceso |
|------|----------|--------|
| `/` | Landing con materias y tutores destacados | público |
| `/materias`, `/tutores`, `/tutores/:id` | Catálogos y perfil del tutor (horario + reseñas) | público |
| `/login`, `/registro` | Acceso y registro (estudiante o tutor) | solo sin sesión (`guestGuard`) |
| `/app/estudiante` · `/app/reservar` | Inicio y reserva en 3 pasos | ESTUDIANTE |
| `/app/tutor` · `/app/disponibilidad` | Inicio y bloques semanales | TUTOR |
| `/app/tutorias` · `/app/tutorias/:id` | Mis tutorías y detalle (ruta de estados, acciones, recursos, evaluación) | ESTUDIANTE, TUTOR (detalle también COORDINADOR) |
| `/app/coordinacion` · `/app/materias` · `/app/supervision` | Inicio, CRUD de materias y supervisión | COORDINADOR |

`/app` está protegido por `authGuard`; cada pantalla por `roleGuard(...)`. Sin permiso → `/sin-permiso`; ruta inexistente → 404.

## Arquitectura (`src/app`)
```
core/
  config/        traducciones (cargador ngx-translate y títulos de pestaña traducidos)
  guards/        authGuard, roleGuard, guestGuard (CanActivateFn)
  interceptors/  authInterceptor: agrega el Bearer y cierra sesión ante un 401
  models/        interfaces de los DTO del backend
  services/      un servicio por recurso de la API + AuthService, AvisoService, IdiomaService
  utils/         errores (ProblemDetail → mensaje), horario, reglas de la máquina de estados
features/
  auth/          login, registro
  public/        landing
  materias/      catálogo, administración, inicio del coordinador
  tutores/       catálogo, perfil, reseñas, mi disponibilidad
  tutorias/      reservar, mis tutorías, detalle, supervisión (+ ruta de estados, acciones, recursos, evaluación)
  dashboard/     inicio del estudiante y del tutor
  errores/       404 y sin permiso
layout/          public-layout (encabezado) y app-layout (barra lateral / barra inferior en celular)
shared/          componentes reutilizables (horario-semanal, estado-badge, estrellas, confirmar-dialogo, …) y pipes
```
Estilos globales en `src/styles/` (`tokens.css`, `base.css`, `components.css`, `utilities.css`): clases `em-*`.

## Decisiones técnicas
- **Standalone + `loadComponent`**: cada pantalla se descarga solo cuando se visita.
- **Signals** (`signal`, `computed`, `input`, `output`) para el estado de cada pantalla; RxJS solo para HTTP.
- **Formularios reactivos tipados** (`FormBuilder.nonNullable`) con validadores iguales a los del backend.
- **Errores RFC 7807**: `mensajeDeError()` muestra el `detail` que manda el backend.
- **Reglas de estado en el cliente** (`core/utils/sesion-reglas.ts`): solo deciden qué botones mostrar; la validación real (traslapes 409, cancelación con 2 h 422) es del backend.
- **Fechas**: se envían en hora local (`aFechaLocal`), nunca con `toISOString()`, porque el backend usa `LocalDateTime`.

## Internacionalización (REQ-19)
Textos en `public/assets/i18n/es.json` y `en.json` (voseo en español). El selector ES/EN está en los encabezados;
el idioma se guarda en `localStorage` y actualiza `<html lang>`. Los mensajes de error que vienen del backend llegan en español.

## Accesibilidad (REQ-20)
Ver `docs/ACCESIBILIDAD.md` (procedimiento de Lighthouse, tabla de puntajes y lista de lo implementado).

## Pruebas
`npm test` ejecuta, entre otras: `auth.service.spec.ts`, `idioma.service.spec.ts`, `horario.spec.ts` y `sesion-reglas.spec.ts`.

Backlog y responsables: `docs/REQUISITOS.md`. Reglas de Git: `CONTRIBUTING.md`.
