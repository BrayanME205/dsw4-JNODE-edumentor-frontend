# EduMentor Hub — Frontend

SPA en **Angular 18 (Standalone Components)** para la plataforma de tutorías entre pares.
Proyecto Integrador IF0009 Desarrollo de Software IV — UCR, II Ciclo 2026.

## Requisitos
- Node.js 20 o superior y npm
- Backend en ejecución en `http://localhost:8080` (ver repositorio backend)

## Ejecución local
```bash
npm install
npm start          # http://localhost:4200
npm test           # pruebas unitarias
npm run build
```

## Arquitectura (src/app)
| Carpeta | Contenido |
|---------|-----------|
| `core/guards` | Guardas funcionales `CanActivateFn` (JWT y rol) |
| `core/interceptors` | Interceptor HTTP funcional (`Authorization: Bearer`) |
| `core/services` | Servicios de acceso a la API (AuthService, etc.) |
| `core/models` | Interfaces TypeScript de los DTO |
| `core/config` | Configuración transversal |
| `features/*` | Una carpeta por funcionalidad, con sus `pages` (componentes standalone) |
| `shared` | Componentes y pipes reutilizables |
| `layout` | Cabecera, navegación y pie de página |
| `public/assets/i18n` | Traducciones `es.json` / `en.json` |

Backlog y responsables: `docs/REQUISITOS.md`. Reglas de Git: `CONTRIBUTING.md`.

## Credenciales de prueba
Se documentarán al completar REQ-21 (backend).
