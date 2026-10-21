# Focus Flow

Aplicación web de productividad personal que combina temporizador Pomodoro, gestión de tareas, notas, planificación de bloques de concentración y estadísticas.

## Stack

- React 18 + TypeScript (modo estricto)
- Vite
- Tailwind CSS
- Motion para React
- Lucide React
- React Hook Form + Zod
- Vitest + React Testing Library

## Scripts

Desde la raíz del proyecto:

```bash
npm install
npm run dev      # Inicia el servidor de desarrollo (Vite)
npm run build    # Genera build de producción
npm run preview  # Vista previa de la build
npm run lint     # Linter del frontend
npm run test     # Ejecuta pruebas unitarias
```

## Estructura (etapa 1)

- `frontend/` — aplicación frontend (Vite + React + TS)
- `Etapas/` — documentación de cada etapa de desarrollo (`.md`)
- `backend/` — API Express + MongoDB Atlas (pendiente, Versión 1.1)
- `docs/` — arquitectura, modelo de datos, contratos de API, despliegue (pendiente)

## Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores necesarios.

## Modo invitado

La aplicación es usable sin registro. Los datos del invitado se persisten en IndexedDB (etapas posteriores).
