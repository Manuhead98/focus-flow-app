# 05-dashboard.md

## Etapa 5 — Dashboard principal

### Objetivo
Crear el dashboard principal que priorice: temporizador, tarea actual, progreso del día y acceso rápido a tareas y notas, permitiendo iniciar una sesión sin navegar por múltiples pantallas.

### Alcance
- Componente `Dashboard` como pantalla principal.
- Layout que coloca el temporizador como elemento principal.
- Panel de tarea actual vinculada al temporizador.
- Indicador de progreso del día (sesiones completadas).
- Acceso rápido a tareas y notas desde el dashboard.
- Integración de Timer, TaskList y NoteList en una vista unificada.
- Navegación clara entre secciones.

### Archivos afectados
- `frontend/src/features/dashboard/Dashboard.tsx`
- `frontend/src/App.tsx` (usar Dashboard como vista principal)
- `frontend/src/features/timer/Timer.tsx` (ajustes si es necesario)

### Criterios de aceptación
- El temporizador es el elemento principal y visible sin scroll.
- La tarea actual vinculada se muestra claramente.
- Se puede iniciar una sesión directamente desde el dashboard.
- Acceso rápido a crear tareas y notas.
- Build de producción exitoso.

### Notas
- Todas las funcionalidades siguen en modo invitado (localStorage).
- Backend en Versión 1.1.
