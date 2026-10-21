# 03-tareas.md

## Etapa 3 — Gestión de tareas

### Objetivo
Implementar el módulo de tareas con CRUD completo, estados, prioridades, filtros y asociación con el temporizador, todo en modo invitado con persistencia local.

### Alcance
- Tipos TypeScript del dominio de tareas.
- Hook `useTasks` con operaciones: crear, consultar, editar, completar, eliminar lógico.
- Filtros por estado y prioridad.
- Asociación opcional con una tarea al iniciar una sesión de temporizador.
- Persistencia local en localStorage (modo invitado).
- Componente `TaskList`, `TaskForm`, `TaskItem`.
- Integración del selector de tarea en el componente `Timer`.
- Pruebas unitarias para reglas de negocio de tareas.

### Archivos afectados
- `frontend/src/features/tasks/types.ts`
- `frontend/src/features/tasks/useTasks.ts`
- `frontend/src/features/tasks/taskUtils.ts`
- `frontend/src/features/tasks/TaskList.tsx`
- `frontend/src/features/tasks/TaskItem.tsx`
- `frontend/src/features/tasks/TaskForm.tsx`
- `frontend/src/features/tasks/tasks.test.ts`
- `frontend/src/features/timer/Timer.tsx` (integración selector de tarea)
- `frontend/src/App.tsx`

### Criterios de aceptación
- Se pueden crear, editar, completar y eliminar tareas.
- Cada tarea tiene: título, descripción opcional, estado, prioridad, fecha planificación opcional, objetivo de Pomodoros, tiempo acumulado, fechas de creación/actualización.
- Filtros por estado y prioridad funcionan.
- La tarea seleccionada se puede asociar al temporizador.
- Persistencia local funciona al recargar la página.
- Pruebas unitarias pasan.
- Build de producción exitoso.

### Notas
- Modo invitado: datos en localStorage.
- Backend y MongoDB Atlas en Versión 1.1 (etapa posterior).
