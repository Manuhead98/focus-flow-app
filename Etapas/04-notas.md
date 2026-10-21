# 04-notas.md

## Etapa 4 — Notas rápidas

### Objetivo
Implementar notas rápidas con crear, editar, eliminar, asociación opcional a tareas y borradores locales, todo en modo invitado con persistencia local.

### Alcance
- Tipos TypeScript del dominio de notas.
- Hook `useNotes` con operaciones CRUD y borradores locales.
- Asociación opcional con una tarea.
- Persistencia local en localStorage.
- Componente `NoteList`, `NoteItem`, `NoteForm`.
- Pruebas unitarias para reglas de negocio de notas.

### Archivos afectados
- `frontend/src/features/notes/types.ts`
- `frontend/src/features/notes/useNotes.ts`
- `frontend/src/features/notes/noteUtils.ts`
- `frontend/src/features/notes/NoteList.tsx`
- `frontend/src/features/notes/NoteItem.tsx`
- `frontend/src/features/notes/NoteForm.tsx`
- `frontend/src/features/notes/notes.test.ts`
- `frontend/src/App.tsx`

### Criterios de aceptación
- Se pueden crear, editar y eliminar notas.
- Cada nota tiene: contenido, referencia opcional a tarea, fechas de creación/actualización.
- Borrador local se conserva al navegar entre secciones.
- Persistencia local funciona al recargar la página.
- Pruebas unitarias pasan.
- Build de producción exitoso.

### Notas
- Modo invitado: datos en localStorage.
- Backend y MongoDB Atlas en Versión 1.1.
