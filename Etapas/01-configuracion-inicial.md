# 01-configuracion-inicial.md

## Etapa 1 — Configuración inicial del proyecto

### Objetivo
Sentar las bases del repositorio Focus Flow con el stack tecnológico definido en el `Prompt_Principal.md`, lista para iniciar el desarrollo del MVP (Versión 1).

### Alcance
- Estructura de carpetas base (`frontend/`, `backend/`, `docs/`, `Etapas/`).
- Inicializar proyecto frontend con Vite + React + TypeScript (modo estricto).
- Instalar y configurar Tailwind CSS.
- Instalar dependencias clave: `motion`, `lucide-react`, `react-hook-form`, `zod`.
- Configurar scripts de desarrollo, build y lint en `package.json`.
- Crear `.env.example` sin secretos reales.
- README con instrucciones básicas de arranque local.

### Archivos afectados
- `package.json` (raíz y frontend)
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js`
- `postcss.config.js`
- `frontend/src/main.tsx`
- `frontend/src/App.tsx`
- `frontend/index.html`
- `.env.example`
- `README.md`

### Criterios de aceptación
- `npm install` ejecuta sin errores.
- `npm run dev` levanta el servidor de Vite en `http://localhost:5173`.
- `npm run build` genera una build de producción válida.
- La aplicación carga en blanco o con un placeholder básico sin errores de consola.

### Notas
- El backend y MongoDB Atlas se implementan en etapas posteriores (Versión 1.1).
- Modo invitado y persistencia local (IndexedDB) se implementan en etapas posteriores.
