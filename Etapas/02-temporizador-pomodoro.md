# 02-temporizador-pomodoro.md

## Etapa 2 — Temporizador Pomodoro

### Objetivo
Implementar un temporizador Pomodoro funcional y confiable basado en marcas temporales (timestamps), no en contadores que resten un segundo por cada render.

### Alcance
- Tipos TypeScript del dominio del temporizador (`fase`, `estado`, `configuración`, `sesión`).
- Hook `useTimer` con lógica de negocio:
  - Duración de trabajo, descanso corto y descanso largo configurables.
  - Cantidad configurable de ciclos antes del descanso largo.
  - Inicio, pausa, reanudación, reinicio y avance manual de fase.
  - Indicador de fase actual y progreso visual del ciclo.
  - Sonido opcional al finalizar una fase.
  - Notificación visual dentro de la app al terminar una fase.
  - Asociación opcional con una tarea.
  - Registro de la sesión completada.
- Estrategia de fiabilidad del reloj basada en `Date.now()` / `performance.now()`:
  - Pausar y reanudar sin perder precisión.
  - Recuperarse después de recargar la página (IndexedDB/localStorage).
  - Detectar si el tiempo objetivo ya pasó al recuperar.
  - Diferenciar estados: activo, pausado, completado, cancelado, interrumpido.
  - Evitar registrar dos veces una misma finalización.
  - Gestionar cambios de fase correctamente.
  - No enviar peticiones HTTP por cada segundo.
- Componente `Timer` con visualización clara del tiempo restante y controles accesibles.
- Pruebas unitarias para cálculo de tiempo restante, transiciones de estado, recuperación tras recarga y reglas de finalización.

### Archivos afectados
- `frontend/src/features/timer/types.ts`
- `frontend/src/features/timer/useTimer.ts`
- `frontend/src/features/timer/timerUtils.ts`
- `frontend/src/features/timer/Timer.tsx`
- `frontend/src/features/timer/timer.test.ts`
- `frontend/src/App.tsx` (integración del temporizador en el dashboard)

### Criterios de aceptación
- El temporizador inicia, pausa, reanuda y reinicia sin perder precisión.
- Al recargar la página, el temporizador recupera su estado persistido.
- El progreso visual refleja el tiempo restante de la fase actual.
- Cambia automáticamente de fase al completar una (trabajo → descanso corto/largo).
- Se puede asociar opcionalmente una tarea a la sesión.
- Al completar una sesión, se registra con duración prevista y real.
- Pruebas unitarias pasan.
- Build de producción exitoso.

### Notas
- No depende del backend; funciona en modo invitado con persistencia local.
- El sonido y la notificación del navegador requieren permiso explícito del usuario (etapa posterior).
