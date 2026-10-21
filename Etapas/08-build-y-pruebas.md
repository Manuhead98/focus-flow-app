# 08-build-y-pruebas.md

## Etapa 8 — Build y pruebas automatizadas

### Objetivo
Consolidar los scripts de desarrollo, build y pruebas, verificando que todo funcione correctamente antes de pasar al backend.

### Alcance
- Scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`, `npm run test`.
- Vitest + React Testing Library para pruebas unitarias.
- 56 pruebas unitarias pasando (temporizador, tareas, notas).
- Build de producción exitoso con Vite.
- `.env.example` sin secretos reales.
- `.gitignore` configurado.
- README con instrucciones de arranque local.

### Archivos afectados
- `frontend/package.json` (scripts)
- `frontend/vitest.config.ts`
- `frontend/vite.config.ts`
- `frontend/tsconfig.json` (modo estricto)
- `.env.example`
- `.gitignore`
- `README.md`
- `Etapas/08-build-y-pruebas.md` (documentación)

### Criterios de aceptación
- `npm install` ejecuta sin errores.
- `npm run dev` levanta Vite en localhost:5173.
- `npm run build` genera build de producción válida.
- `npm run test` pasa todas las pruebas (56 tests).
- `npm run lint` ejecuta sin errores críticos.
- `.env.example` sin credenciales reales.

### Notas
- Backend, MongoDB Atlas, Google OAuth y despliegue en Vercel en Versión 1.1.
