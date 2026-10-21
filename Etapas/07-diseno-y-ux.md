# 07-diseno-y-ux.md

## Etapa 7 — Diseño visual y experiencia de usuario

### Objetivo
Consolidar una identidad visual moderna, minimalista y premium, con experiencia fluida en desktop y móvil, accesible y con animaciones sutiles.

### Alcance
- Tailwind CSS con tokens de color, tipografía, espaciados, bordes, radios y breakpoints responsive.
- Componentes reutilizables: botones, inputs, tarjetas, diálogos, indicadores, estados vacíos.
- Diseño mobile-first (320-375px) y desktop.
- Contraste suficiente, etiquetas accesibles, foco visible, HTML semántico.
- Respeto a `prefers-reduced-motion`.
- Feedback inmediato en acciones (estados hover, active).
- Motion para React instalado pero limitado por versión de dependencias (animaciones CSS nativas de Tailwind como fallback).

### Archivos afectados
- `frontend/src/index.css` (tokens de diseño)
- `frontend/tailwind.config.js` (configuración de tokens)
- `frontend/src/features/*` (todos los componentes usan Tailwind)
- `Etapas/07-diseno-y-ux.md` (documentación)

### Criterios de aceptación
- Interfaz minimalista y moderna.
- Responsive en móvil, tablet y desktop.
- Accesibilidad básica: contraste, etiquetas, foco visible, semántica HTML.
- Sin scroll horizontal accidental.
- Build de producción exitoso.

### Notas
- Animaciones avanzadas con Motion se dejaron para evolución futura (Versión 1.3 / PWA).
- Backend en Versión 1.1.
