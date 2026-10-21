# Proyecto: Focus Flow — Focus & Productivity

## 1. Rol y objetivo principal

Actuá como un desarrollador Full Stack senior especializado en React, TypeScript, Node.js, arquitectura de software, MongoDB, autenticación, seguridad, diseño UI/UX y despliegue en plataformas serverless.

Tu objetivo es diseñar e implementar **Focus Flow**, una aplicación web de productividad personal que combine un temporizador Pomodoro, gestión de tareas, notas, planificación de bloques de concentración, notificaciones y estadísticas.

La aplicación debe tener una identidad visual moderna, una experiencia fluida y una arquitectura profesional, mantenible y preparada para evolucionar.

No quiero un temporizador básico con un botón de inicio y otro de pausa. Quiero un pequeño producto real que ayude al usuario a organizar su jornada y registrar su tiempo de concentración.

La aplicación formará parte de mi portfolio profesional y se publicará en Vercel. Cualquier visitante debe poder entrar, probar las funcionalidades principales y decidir si desea crear una cuenta.

La prioridad es entregar una aplicación funcional, visualmente cuidada, segura y bien estructurada, sin introducir complejidad arquitectónica innecesaria.

## 2. Análisis previo y uso de skills

Antes de implementar:

1. Inspeccioná el repositorio, su estructura, las dependencias existentes, los scripts y las configuraciones de TypeScript, Vite y Vercel.
2. Revisá las skills de OpenCode y los agentes disponibles. Identificá las instrucciones relevantes para React, Node.js, MongoDB, autenticación, seguridad, testing y diseño de interfaces.
3. Respetá AGENTS.md, las instrucciones del repositorio, las convenciones existentes y las skills aplicables. No inventes herramientas, skills ni capacidades.
4. Definí las decisiones arquitectónicas, el modelo de datos, los contratos de la API y el flujo de autenticación antes de construir las funcionalidades dependientes.
5. Proponé un roadmap incremental con criterios de aceptación verificables.
6. Si existe código previo, analizalo y reutilizalo cuando sea correcto. No reemplaces indiscriminadamente archivos o configuraciones.
7. Implementá las funcionalidades reales, ejecutá pruebas y builds, y corregí los problemas detectados.
8. Documentá las decisiones técnicas importantes y las limitaciones que no puedan resolverse dentro del alcance.

No des por terminada una funcionalidad porque existe su interfaz visual. Debe cumplir su comportamiento esperado, manejar errores y persistir los datos cuando corresponda.

## 3. Stack tecnológico

### Frontend

- React.
- TypeScript en modo estricto.
- Vite.
- Tailwind CSS.
- Motion para React, mediante el paquete oficial `motion` y sus APIs actuales.
- Lucide React.
- React Hook Form y Zod cuando aporten valor a los formularios y su validación.
- Vitest y React Testing Library.
- Playwright para pruebas end-to-end cuando sea posible.

### Backend

- Node.js.
- TypeScript.
- Express.
- MongoDB Atlas.
- Mongoose para modelos, validación de esquemas e índices.
- Zod para validar las entradas de la API y los datos externos.
- Una biblioteca de autenticación compatible con Google OAuth y el entorno de despliegue, seleccionada después de verificar su documentación vigente.

### Infraestructura

- Vercel para frontend y funciones backend.
- MongoDB Atlas para persistencia en la nube.
- Google OAuth para registro e inicio de sesión.
- IndexedDB para persistencia local del invitado.
- Web Notifications API y Web Audio API cuando sean compatibles y cuenten con los permisos necesarios.

No agregues tecnologías equivalentes para resolver el mismo problema. Verificá las versiones actuales y su compatibilidad antes de instalar dependencias.

## 4. Arquitectura: monolito modular con capas internas

Utilizá un **monolito modular en el backend, organizado por funcionalidades y con capas internas inspiradas en MVC y separación de responsabilidades**.

No implementes microservicios para esta aplicación. El dominio y la escala inicial no justifican esa complejidad.

El frontend y el backend estarán separados por responsabilidades y podrán organizarse dentro de un mismo repositorio.

### 4.1. Organización general

Estructura orientativa:

focus-flow/
  frontend/
    src/
      app/
      components/
        ui/
        layout/
      features/
        timer/
        tasks/
        notes/
        planning/
        statistics/
        auth/
      hooks/
      services/
      lib/
      types/
      styles/
    package.json

  backend/
    src/
      app.ts
      server.ts
      config/
      shared/
        database/
        middleware/
        errors/
        utils/
        auth/
      modules/
        auth/
        users/
        tasks/
        notes/
        sessions/
        planning/
        statistics/
    api/
      index.ts
    package.json

  docs/
    architecture.md
    data-model.md
    api-contracts.md
    deployment.md

  README.md

Esta estructura es una base de referencia. Adaptala cuando sea necesario, justificando cualquier cambio.

### 4.2. Responsabilidades del backend

Dentro de cada módulo separá, cuando corresponda:

- Routes: definición de endpoints y middlewares.
- Controllers: adaptación entre HTTP y la lógica de aplicación.
- Services: lógica de negocio y casos de uso.
- Models: esquemas de persistencia con Mongoose.
- Validation: esquemas de entrada y validación.
- Repositories: acceso a datos cuando la complejidad lo justifique.

No crees capas vacías que solo reenvíen llamadas sin aportar separación, ni permitas que los controllers acumulen lógica de negocio.

Los servicios de un módulo no deben importar arbitrariamente detalles internos de otros módulos. Definí contratos explícitos y evitá dependencias circulares.

Los modelos de Mongoose pertenecen a la infraestructura de persistencia; la lógica de negocio no debe depender innecesariamente de detalles específicos de MongoDB.

### 4.3. Responsabilidades del frontend

- `features`: funcionalidades y componentes específicos del dominio.
- `components/ui`: componentes visuales reutilizables.
- `services`: comunicación tipada con la API.
- `hooks`: lógica reutilizable de React.
- `app`: rutas y composición general.
- `lib`: utilidades transversales.
- `types`: contratos compartidos cuando corresponda.

No concentres toda la lógica en App.tsx ni dupliques reglas de negocio entre componentes.

## 5. Despliegue y restricciones de Vercel

El sistema debe poder ejecutarse localmente y desplegarse en Vercel.

Evaluá y documentá una configuración compatible con Vercel Functions para la API Express, adaptando el punto de entrada a su entorno serverless.

Requisitos:

- No depender de un servidor Express ejecutándose continuamente.
- No utilizar temporizadores de Node.js para mantener sesiones Pomodoro activas.
- No depender de variables en memoria para conservar datos entre invocaciones.
- Reutilizar conexiones a MongoDB cuando el entorno lo permita, evitando abrir conexiones innecesarias.
- Mantener secretos exclusivamente en variables de entorno del backend.
- Configurar CORS de forma restrictiva si frontend y API tienen orígenes diferentes.
- Gestionar errores y respuestas HTTP de forma consistente.
- Documentar los comandos de desarrollo, build y despliegue.

Si el uso de Express en Vercel exige ajustes específicos de enrutamiento, verificá la documentación oficial actual. No asumas que una configuración de servidor tradicional funcionará automáticamente en producción.

## 6. MVP funcional

### 6.1. Temporizador Pomodoro

Implementá un temporizador funcional con:

- Duración de trabajo configurable.
- Descanso corto configurable.
- Descanso largo configurable.
- Cantidad configurable de ciclos antes del descanso largo.
- Inicio, pausa, reanudación, reinicio y avance manual de fase.
- Indicador de fase actual.
- Progreso visual del ciclo.
- Sonido opcional al finalizar.
- Notificación cuando termina una fase, si los permisos y el contexto lo permiten.
- Asociación opcional con una tarea.
- Registro de la sesión completada.

La configuración inicial puede ser de 25 minutos de trabajo, 5 de descanso corto y 15 de descanso largo, pero el usuario debe poder cambiarla.

### 6.2. Fiabilidad del reloj

No implementes el temporizador como un simple contador que resta uno cada segundo y asume que el navegador siempre permanece activo.

Utilizá una estrategia basada en marcas temporales, con una fecha objetivo de finalización y un estado explícito del temporizador.

Debe poder:

- Pausarse y reanudarse sin perder precisión.
- Recuperarse después de recargar la página.
- Evitar que la sesión se prolongue incorrectamente al volver de una pestaña suspendida.
- Detectar si el tiempo objetivo ya pasó.
- Diferenciar entre una sesión activa, pausada, completada, cancelada o interrumpida.
- Evitar registrar dos veces una misma finalización.
- Gestionar correctamente los cambios de fase.

El temporizador debe funcionar sin conexión permanente con el backend. No se debe enviar una petición HTTP por cada segundo.

Documentá cómo se recupera una sesión si el navegador se cierra, el dispositivo se suspende o la aplicación permanece abierta durante mucho tiempo.

No afirmes que el temporizador web puede garantizar ejecución puntual en segundo plano en todos los navegadores.

### 6.3. Tareas

Cada tarea debe permitir:

- Título.
- Descripción opcional.
- Estado.
- Prioridad.
- Fecha de planificación opcional.
- Cantidad objetivo de Pomodoros.
- Tiempo real acumulado.
- Fecha de creación y actualización.
- Asociación con sesiones y notas cuando corresponda.

Implementá creación, consulta, edición, finalización y eliminación lógica o eliminación controlada según la política que definas.

Agregá filtros por estado y prioridad.

La tarea seleccionada debe poder vincularse al temporizador.

### 6.4. Notas

Permití:

- Crear notas rápidas.
- Editar y eliminar notas.
- Asociar una nota con una tarea de manera opcional.
- Consultar fecha de creación y actualización.
- Conservar el contenido al navegar entre secciones.
- Guardar borradores locales cuando sea razonable.

En modo invitado, las notas se guardan localmente. En modo autenticado, la API es la fuente de persistencia.

No sobrescribas notas nuevas con respuestas antiguas ni muestres falsamente que una nota está guardada en la nube si la petición falló.

### 6.5. Historial y estadísticas

Registrá las sesiones con su duración prevista y real, fechas, resultado y tarea asociada cuando exista.

Mostrá:

- Pomodoros completados.
- Minutos de concentración.
- Tiempo por tarea.
- Resumen diario.
- Tendencias por semana.
- Progreso hacia objetivos diarios.

Las estadísticas deben derivarse de sesiones reales. No inventes datos para llenar gráficos.

Definí claramente cómo se calculan los minutos, cómo se tratan las sesiones interrumpidas y qué zona horaria se utiliza para agrupar los resultados.

## 7. Modo invitado y cuenta opcional

Este requisito es central y debe estar contemplado desde el diseño de la arquitectura.

### 7.1. Modo invitado

Cualquier visitante debe poder comenzar a utilizar la aplicación sin registrarse.

El invitado puede:

- Usar el temporizador.
- Crear tareas.
- Crear notas.
- Configurar ciclos.
- Programar bloques.
- Consultar su historial local.

Los datos del invitado se guardan en IndexedDB.

El estado activo del temporizador debe recuperarse de manera consistente, utilizando marcas temporales y un estado persistido.

No crees registros anónimos en MongoDB para los visitantes.

Mostrá una opción visible para registrarse y conservar los datos en la nube, sin bloquear la experiencia principal.

### 7.2. Registro e inicio de sesión con Google

La cuenta debe ser opcional y permitir:

- Registrarse con Google.
- Iniciar sesión con Google.
- Cerrar sesión.
- Recuperar la sesión autenticada cuando corresponda.
- Consultar los datos asociados a la cuenta.
- Sincronizar datos entre dispositivos.

Utilizá un flujo OAuth seguro con una biblioteca compatible o Google Identity Services.

Verificá la identidad en el backend mediante tokens válidos o una sesión segura. Nunca confíes en un identificador de usuario enviado por el cliente como prueba de identidad.

Si utilizás cookies de sesión, configurá atributos apropiados de `HttpOnly`, `Secure` y `SameSite`, junto con protección CSRF cuando corresponda. Si utilizás tokens, definí su almacenamiento, expiración, renovación y revocación de manera segura.

No implementes una autenticación casera basada en datos del perfil de Google sin verificar las credenciales.

### 7.3. Migración del invitado a la cuenta

Cuando un invitado decide registrarse, debe poder conservar sus tareas, notas, preferencias e historial local.

Diseñá un flujo de migración que:

1. Identifique los datos locales pendientes.
2. Muestre al usuario qué se va a importar.
3. Valide la estructura y los tamaños permitidos.
4. Requiera una sesión autenticada.
5. Asocie los datos al usuario autenticado en el servidor.
6. Evite duplicados mediante identificadores e idempotencia.
7. Gestione fallos parciales sin perder los datos originales.
8. Confirme qué se importó correctamente.
9. Elimine los datos locales migrados únicamente después de confirmar el éxito y mantener una estrategia segura de recuperación.

La migración debe ser segura, repetible y resistente a reintentos.

No permitas que el cliente pueda asignar registros a otro usuario modificando un campo de propietario.

### 7.4. Límites de la persistencia local

Documentá qué sucede cuando el usuario:

- Borra los datos del navegador.
- Cambia de dispositivo.
- Utiliza otro navegador.
- Pierde conexión.
- Se registra desde otro dispositivo.
- Tiene datos locales y datos remotos que deben combinarse.

No prometas sincronización entre dispositivos para datos que solo existen localmente.

## 8. Modelo de datos en MongoDB Atlas

Diseñá un modelo pequeño, coherente y extensible.

Como base, evaluá las siguientes colecciones:

### `users`

- Identificador interno.
- Identificador externo de Google.
- Correo verificado.
- Nombre y datos de perfil estrictamente necesarios.
- Preferencias de temporizador.
- Preferencias de notificaciones.
- Fechas de creación y actualización.

No guardes contraseñas de Google ni tokens sensibles innecesarios.

Definí índices únicos apropiados y una estrategia segura para vincular identidades externas.

### `tasks`

- Propietario.
- Título y descripción.
- Estado.
- Prioridad.
- Fecha de planificación.
- Objetivo de Pomodoros.
- Fechas de auditoría.

### `notes`

- Propietario.
- Contenido.
- Referencia opcional a una tarea.
- Fechas de auditoría.

### `focusSessions`

- Propietario.
- Referencia opcional a una tarea.
- Tipo de fase.
- Duración prevista.
- Inicio y finalización.
- Duración real.
- Estado final.
- Motivo de interrupción, cuando corresponda.

### Planificación

Para el MVP, evaluá almacenar los bloques programados dentro de `tasks` o en una colección independiente `plannedBlocks`.

Elegí la opción que produzca un modelo más claro y justificá la decisión. Evitá duplicar innecesariamente información derivable.

Para todas las entidades:

- Definí tipos TypeScript.
- Definí esquemas de Mongoose.
- Definí validaciones.
- Definí índices.
- Documentá relaciones y reglas de eliminación.
- Establecé límites de tamaño y formatos permitidos.
- Utilizá fechas de manera consistente.

Cada consulta o modificación de datos privados debe estar restringida al propietario autenticado. La API no debe confiar en un `userId` arbitrario recibido desde el frontend.

No crees una colección por cada campo o preferencia. Tampoco introduzcas relaciones artificiales únicamente para imitar una base relacional.

## 9. API REST

Diseñá y documentá los endpoints antes de implementar sus consumidores.

Como referencia, contemplá:

- `/api/auth/*`
- `/api/users/me`
- `/api/tasks`
- `/api/notes`
- `/api/sessions`
- `/api/planning`
- `/api/statistics`

Definí métodos HTTP, esquemas de entrada, respuestas, códigos de error y políticas de autorización.

Las operaciones deben permitir crear, consultar, modificar y eliminar las entidades correspondientes, además de filtros y paginación cuando sean necesarios.

Requisitos:

- Validación de parámetros, query strings y body.
- Autenticación y autorización en el backend.
- Respuestas de error consistentes.
- Manejo centralizado de errores.
- Protección contra acceso a recursos de otros usuarios.
- Límites de tamaño para textos y solicitudes.
- Control de concurrencia cuando una operación pueda sobrescribir cambios.
- Registro de errores sin exponer información sensible.
- Documentación de la API.

Para el modo invitado no es necesario crear endpoints de datos anónimos. Los datos locales se gestionan desde el cliente hasta que el usuario decide migrarlos.

## 10. Planificación de sesiones

Implementá un planificador diario de bloques de concentración.

Cada bloque puede incluir:

- Tarea asociada.
- Fecha y hora planificadas.
- Duración objetivo.
- Cantidad prevista de Pomodoros.
- Estado.
- Orden del bloque.
- Observaciones opcionales.

Permití:

- Crear y modificar bloques.
- Reordenarlos.
- Marcar bloques como completados o pendientes.
- Iniciar una sesión desde un bloque.
- Comparar duración prevista con tiempo real.

Evitá crear un sistema complejo de calendarios recurrentes en el MVP.

Los horarios deben mostrarse en la zona horaria local del usuario y tratar correctamente cambios de día y diferencias de zona horaria.

## 11. Notificaciones y sonidos

Implementá una estrategia realista de notificaciones web.

### Primera etapa

- Sonido opcional al terminar una fase.
- Aviso visual dentro de la aplicación.
- Notificación del navegador cuando se disponga del permiso.
- Configuración de sonidos y avisos.
- Solicitud de permiso solo después de una acción explícita del usuario.

### Evolución

Evaluá convertir la aplicación en una PWA con manifest y service worker.

Diferenciá:

- Avisos dentro de la interfaz.
- Notificaciones del navegador.
- Notificaciones push.
- Alertas programadas en segundo plano.

No confundas estas capacidades.

Un temporizador ejecutado únicamente en el frontend no garantiza notificaciones puntuales si el navegador está cerrado o el sistema suspende la aplicación.

Si las notificaciones deben llegar con la aplicación cerrada, investigá una arquitectura push con service worker y un mecanismo de programación fiable. No uses funciones serverless efímeras como si fueran procesos permanentes.

No agregues cron jobs, colas o proveedores externos al MVP si no son necesarios. Documentá las limitaciones y proponé una evolución realista.

## 12. Diseño visual y experiencia de usuario

El diseño debe tener una identidad propia y calidad suficiente para un portfolio profesional.

Dirección visual:

- Minimalista, moderna y premium.
- Orientada a concentración y productividad.
- Jerarquía visual clara.
- Tipografía legible.
- Espaciado consistente.
- Colores que diferencien fases sin sobrecargar.
- Tarjetas, paneles y formularios visualmente coherentes.
- Feedback inmediato en las acciones.
- Buena experiencia tanto en desktop como en dispositivos móviles.

Evitá copiar una interfaz existente. Diseñá una experiencia original.

### 12.1. Dashboard

La pantalla principal debe priorizar:

- Temporizador.
- Tarea actual.
- Controles principales.
- Próximo bloque planificado.
- Progreso del día.
- Acceso rápido a tareas y notas.

El usuario debe poder iniciar una sesión sin navegar por múltiples pantallas.

### 12.2. Diseño del temporizador

Implementá una visualización clara y atractiva del tiempo restante.

Evaluá un círculo de progreso o una composición equivalente, con transiciones fluidas y controles accesibles.

Las animaciones no deben afectar la precisión del temporizador.

### 12.3. Sistema de diseño

Utilizá Tailwind CSS para establecer:

- Tokens de color.
- Tipografía.
- Espaciados.
- Bordes y radios.
- Elevaciones.
- Estados de interacción.
- Breakpoints responsive.

Utilizá componentes reutilizables para botones, inputs, tarjetas, diálogos, indicadores, estados vacíos y notificaciones.

No mezcles Tailwind con otro framework visual completo sin una necesidad justificada.

### 12.4. Animaciones con Motion

Utilizá Motion para:

- Transiciones entre vistas.
- Aparición de tarjetas y paneles.
- Feedback de inicio, pausa y finalización.
- Transiciones de estado.
- Apertura de diálogos.
- Reordenamiento visual de bloques cuando aporte valor.
- Microinteracciones en botones y controles.

Evitá animaciones excesivas y no animes continuamente el temporizador mediante renders innecesarios.

Respetá `prefers-reduced-motion`, los estados de foco y la navegación por teclado.

Las animaciones deben mejorar la experiencia, no ser un requisito para entender la interfaz.

## 13. Responsive y accesibilidad

La aplicación debe ser mobile-first y funcionar correctamente en pantallas de aproximadamente 320–375 px, tablets y desktop.

Verificá:

- Sin scroll horizontal accidental.
- Controles táctiles accesibles.
- Formularios utilizables desde el celular.
- Navegación clara.
- Modales que se adapten al viewport.
- Contraste suficiente.
- Etiquetas accesibles.
- Foco visible.
- Uso correcto de HTML semántico.
- Compatibilidad con lectores de pantalla.
- Respeto por las preferencias de movimiento.

En desktop podés aprovechar un dashboard con varias áreas; en móvil, priorizá el temporizador y la tarea activa, con navegación simplificada.

## 14. Seguridad

La aplicación debe contemplar desde el principio:

- Verificación de identidad en el backend.
- Autorización por propietario.
- Validación de todas las entradas.
- Protección de credenciales.
- CORS restrictivo cuando corresponda.
- Manejo seguro de sesiones y tokens.
- Protección CSRF cuando la estrategia de autenticación lo requiera.
- Límites de solicitudes razonables.
- Gestión de errores sin revelar stack traces ni secretos.
- Sanitización y presentación segura de notas y descripciones.
- Protección de endpoints de estadísticas y migración.
- Prevención de duplicación de operaciones sensibles.

No confíes en las validaciones del frontend como mecanismo de seguridad.

No expongas la cadena de conexión de MongoDB, secretos OAuth ni credenciales en variables públicas del frontend.

## 15. Evolución por versiones

### Versión 1 — MVP

- Temporizador configurable.
- Modo invitado.
- Persistencia local.
- Tareas y notas.
- Historial local.
- Dashboard responsive.
- Diseño visual y animaciones.
- Build y pruebas automatizadas.

### Versión 1.1 — Backend y cuentas

- API REST.
- MongoDB Atlas.
- Registro e inicio de sesión con Google.
- Persistencia remota.
- Separación de datos por usuario.
- Gestión segura de sesión.
- Migración del invitado.

### Versión 1.2 — Productividad avanzada

- Planificación diaria.
- Asociación de sesiones con tareas.
- Estadísticas reales.
- Filtros e historial ampliado.
- Configuración avanzada de ciclos.

### Versión 1.3 — Experiencia mejorada

- PWA.
- Mejoras de recuperación del temporizador.
- Notificaciones adicionales compatibles con la plataforma.
- Mejoras de accesibilidad.
- Optimización de rendimiento.

### Evolución futura

Evaluá, según la necesidad real:

- Sincronización y resolución de conflictos.
- Exportación de datos.
- Objetivos semanales.
- Etiquetas y categorías.
- Integraciones externas.
- Notificaciones push fiables.
- Copias de seguridad y herramientas de administración.

No implementes todas las versiones simultáneamente. Priorizá un MVP estable y evolucioná sin romper los contratos ni perder datos.

## 16. Testing y criterios de aceptación

Implementá pruebas unitarias para:

- Cálculo del tiempo restante.
- Transiciones de estado del temporizador.
- Recuperación después de una recarga.
- Reglas de finalización.
- Registro de sesiones.
- Validaciones de tareas y notas.
- Cálculo de estadísticas.
- Validación de entradas del backend.
- Autorización por usuario.
- Migración de datos del invitado.
- Idempotencia y reintentos.

Implementá pruebas de integración para endpoints y persistencia, utilizando una base de pruebas aislada.

Implementá pruebas end-to-end para los flujos críticos:

1. Entrar como invitado.
2. Crear una tarea y una nota.
3. Iniciar, pausar y completar una sesión.
4. Recargar la página y recuperar el estado.
5. Registrarse con Google en el entorno de pruebas.
6. Migrar los datos del invitado.
7. Consultar los datos desde una sesión autenticada.
8. Verificar que otro usuario no pueda acceder a esos datos.
9. Manejar errores de red y persistencia.

No uses cuentas reales ni credenciales personales en las pruebas automatizadas.

La aplicación se considera terminada cuando:

- El temporizador es funcional y recuperable.
- Los datos del invitado persisten localmente.
- Google OAuth funciona con una configuración válida.
- Las operaciones autenticadas están protegidas.
- Los datos se guardan correctamente en MongoDB.
- La migración conserva los datos y evita duplicados.
- Las tareas, notas, planificación e historial funcionan.
- Las estadísticas se calculan a partir de sesiones reales.
- La interfaz es responsive y accesible.
- Las limitaciones de las notificaciones están documentadas.
- Los tests implementados y el build se ejecutan correctamente.
- El despliegue en Vercel funciona sin depender de procesos permanentes.

## 17. Documentación y entregables

Entregá:

- Código funcional y organizado.
- README con instrucciones locales.
- Arquitectura y responsabilidades de los módulos.
- Diagrama o documentación del modelo de datos.
- Contratos de API.
- Variables de entorno necesarias, mediante un `.env.example` sin secretos.
- Instrucciones para configurar MongoDB Atlas.
- Instrucciones para configurar Google OAuth y sus URLs autorizadas.
- Instrucciones para desplegar frontend y backend en Vercel.
- Guía de pruebas.
- Resumen de funcionalidades implementadas.
- Limitaciones conocidas.
- Roadmap de evolución.

No incluyas credenciales reales en los archivos de ejemplo.

No afirmes que la autenticación, el despliegue o las notificaciones están configurados si requieren acciones externas que todavía no se realizaron.

## 18. Forma de trabajo

Trabajá en etapas incrementales.

Antes de cada etapa, identificá sus dependencias. Después, implementá, probá y corregí los problemas antes de avanzar.

Priorizá:

1. Arquitectura clara.
2. Funcionalidad real.
3. Seguridad.
4. Persistencia consistente.
5. Experiencia de usuario.
6. Accesibilidad.
7. Rendimiento.
8. Facilidad de mantenimiento.

No introduzcas microservicios, colas, procesos permanentes ni abstracciones innecesarias.

El resultado debe ser una aplicación de productividad completa, visualmente atractiva y técnicamente sólida, que pueda probarse desde mi portfolio y demuestre conocimientos reales de desarrollo Full Stack.