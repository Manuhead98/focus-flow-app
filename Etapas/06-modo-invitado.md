# 06-modo-invitado.md

## Etapa 6 — Modo invitado y persistencia local

### Objetivo
Consolidar el modo invitado como experiencia central: cualquier visitante puede usar la app sin registrarse, con datos guardados localmente y una opción visible para crear cuenta sin bloquear el uso principal.

### Alcance
- Confirmar que todas las funcionalidades del MVP funcionan en modo invitado (temporizador, tareas, notas).
- Persistencia local mediante localStorage (temporizador, tareas, notas).
- Recuperación automática de estado al recargar la página.
- Opción visible de "Crear cuenta" e "Iniciar sesión" sin bloquear la experiencia principal.
- Documentar límites de persistencia local (borrar datos, cambiar dispositivo, otro navegador).
- No crear registros anónimos en MongoDB (backend en Versión 1.1).

### Archivos afectados
- `Etapas/06-modo-invitado.md` (documentación)
- `frontend/src/App.tsx` (verificar botones de cuenta visibles pero no obligatorios)
- `README.md` (documentar modo invitado)

### Criterios de aceptación
- Se puede usar el temporizador, crear tareas y notas sin cuenta.
- Los datos persisten al recargar la página.
- Los botones de cuenta están visibles pero no bloquean el uso.
- Documentación de límites de IndexedDB/localStorage.
- Build de producción exitoso.

### Notas
- Backend, MongoDB Atlas y Google OAuth en Versión 1.1 (etapa posterior).
