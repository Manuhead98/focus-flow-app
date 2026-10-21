import type {
  ConfiguracionTemporizador,
  EstadoTemporizador,
  FasePomodoro,
  SesionTemporizador,
} from './types';

export const SEGUNDOS_POR_MINUTO = 60;
export { CONFIGURACION_POR_DEFECTO } from './types';

export const ESTADO_INACTIVO: EstadoTemporizador = 'inactivo';
export const ESTADO_ACTIVO: EstadoTemporizador = 'activo';
export const ESTADO_PAUSADO: EstadoTemporizador = 'pausado';
export const ESTADO_COMPLETADO: EstadoTemporizador = 'completado';
export const ESTADO_CANCELADO: EstadoTemporizador = 'cancelado';
export const ESTADO_INTERRUMPIDO: EstadoTemporizador = 'interrumpido';

export const FASE_TRABAJO: FasePomodoro = 'trabajo';
export const FASE_DESCANSO_CORTO: FasePomodoro = 'descansoCorto';
export const FASE_DESCANSO_LARGO: FasePomodoro = 'descansoLargo';

export const STORAGE_KEY = 'focus-flow-timer';

export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function ahora(): number {
  return Date.now();
}

export function minutosASegundos(minutos: number): number {
  return Math.round(minutos * SEGUNDOS_POR_MINUTO);
}

export function segundosAMinutos(segundos: number): number {
  return segundos / SEGUNDOS_POR_MINUTO;
}

export function formatearTiempo(segundosTotales: number): string {
  const segundos = Math.max(0, Math.floor(segundosTotales));
  const minutos = Math.floor(segundos / 60);
  const restoSegundos = segundos % 60;
  return `${minutos.toString().padStart(2, '0')}:${restoSegundos
    .toString()
    .padStart(2, '0')}`;
}

export function calcularTiempoRestanteSegundos(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): number {
  if (
    sesion.estado !== ESTADO_ACTIVO ||
    !sesion.tiempoFinObjetivo ||
    !sesion.tiempoInicio
  ) {
    return sesion.duracionRealSegundos > 0
      ? sesion.duracionPrevistaSegundos - sesion.duracionRealSegundos
      : sesion.duracionPrevistaSegundos;
  }

  const transcurridoSegundos =
    (ahoraMs - sesion.tiempoInicio - sesion.tiempoTotalPausadoSegundos * 1000) /
    1000;
  const restante = sesion.duracionPrevistaSegundos - transcurridoSegundos;
  return Math.max(0, Math.floor(restante));
}

export function determinarSiguienteFase(
  faseActual: FasePomodoro,
  cicloActual: number,
  ciclosAntesDescansoLargo: number
): FasePomodoro {
  if (faseActual !== FASE_TRABAJO) {
    return FASE_TRABAJO;
  }

  const siguienteCiclo = cicloActual + 1;
  if (siguienteCiclo % ciclosAntesDescansoLargo === 0) {
    return FASE_DESCANSO_LARGO;
  }
  return FASE_DESCANSO_CORTO;
}

export function duracionParaFase(
  fase: FasePomodoro,
  config: ConfiguracionTemporizador
): number {
  switch (fase) {
    case FASE_TRABAJO:
      return minutosASegundos(config.trabajoMinutos);
    case FASE_DESCANSO_CORTO:
      return minutosASegundos(config.descansoCortoMinutos);
    case FASE_DESCANSO_LARGO:
      return minutosASegundos(config.descansoLargoMinutos);
  }
  return minutosASegundos(config.trabajoMinutos);
}

export function crearSesionInicial(
  fase: FasePomodoro,
  config: ConfiguracionTemporizador,
  tareaId: string | null = null
): SesionTemporizador {
  const ahoraMs = Date.now();
  const duracion = duracionParaFase(fase, config);

  return {
    id: generarId(),
    fase,
    estado: ESTADO_INACTIVO,
    duracionPrevistaSegundos: duracion,
    tiempoInicio: null,
    tiempoFinObjetivo: null,
    tiempoPausadoEn: null,
    tiempoTotalPausadoSegundos: 0,
    duracionRealSegundos: 0,
    tareaId,
    completada: false,
    motivoInterrupcion: null,
    fechaCreacion: ahoraMs,
    fechaActualizacion: ahoraMs,
  };
}

export function iniciarSesion(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (sesion.estado === ESTADO_ACTIVO) {
    return sesion;
  }

  const duracionReal = sesion.duracionRealSegundos;
  const duracionPrevista = sesion.duracionPrevistaSegundos;
  const restante = Math.max(0, duracionPrevista - duracionReal);

  if (restante <= 0) {
    return {
      ...sesion,
      estado: ESTADO_COMPLETADO,
      completada: true,
      fechaActualizacion: ahoraMs,
    };
  }

  const tiempoFinObjetivo = ahoraMs + restante * 1000;

  return {
    ...sesion,
    estado: ESTADO_ACTIVO,
    tiempoInicio: ahoraMs,
    tiempoFinObjetivo,
    tiempoPausadoEn: null,
    fechaActualizacion: ahoraMs,
  };
}

export function pausarSesion(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (sesion.estado !== ESTADO_ACTIVO || !sesion.tiempoInicio) {
    return sesion;
  }

  const transcurridoSegundos =
    (ahoraMs - sesion.tiempoInicio - sesion.tiempoTotalPausadoSegundos * 1000) /
    1000;
  const duracionReal = Math.min(
    sesion.duracionPrevistaSegundos,
    Math.floor(sesion.duracionRealSegundos + transcurridoSegundos)
  );

  return {
    ...sesion,
    estado: ESTADO_PAUSADO,
    tiempoPausadoEn: ahoraMs,
    duracionRealSegundos: duracionReal,
    fechaActualizacion: ahoraMs,
  };
}

export function reanudarSesion(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (sesion.estado !== ESTADO_PAUSADO) {
    return sesion;
  }

  const tiempoPausadoSegundos =
    sesion.tiempoPausadoEn !== null
      ? Math.floor((ahoraMs - sesion.tiempoPausadoEn) / 1000)
      : 0;
  const tiempoTotalPausado =
    sesion.tiempoTotalPausadoSegundos + tiempoPausadoSegundos;
  const duracionReal = sesion.duracionRealSegundos;
  const duracionPrevista = sesion.duracionPrevistaSegundos;
  const restante = Math.max(0, duracionPrevista - duracionReal);

  if (restante <= 0) {
    return {
      ...sesion,
      estado: ESTADO_COMPLETADO,
      completada: true,
      tiempoTotalPausadoSegundos: tiempoTotalPausado,
      fechaActualizacion: ahoraMs,
    };
  }

  const tiempoFinObjetivo = ahoraMs + restante * 1000;

  return {
    ...sesion,
    estado: ESTADO_ACTIVO,
    tiempoInicio: ahoraMs,
    tiempoFinObjetivo,
    tiempoPausadoEn: null,
    tiempoTotalPausadoSegundos: tiempoTotalPausado,
    fechaActualizacion: ahoraMs,
  };
}

export function reiniciarSesion(
  sesion: SesionTemporizador,
  fase: FasePomodoro,
  config: ConfiguracionTemporizador,
  tareaId: string | null = null,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  return {
    ...crearSesionInicial(fase, config, tareaId),
    id: sesion.id,
    fechaCreacion: ahoraMs,
    fechaActualizacion: ahoraMs,
  };
}

export function completarSesion(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (sesion.completada) {
    return sesion;
  }

  return {
    ...sesion,
    estado: ESTADO_COMPLETADO,
    completada: true,
    duracionRealSegundos: sesion.duracionPrevistaSegundos,
    fechaActualizacion: ahoraMs,
  };
}

export function cancelarSesion(
  sesion: SesionTemporizador,
  motivo: string,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (sesion.estado === ESTADO_CANCELADO) {
    return sesion;
  }

  return {
    ...sesion,
    estado: ESTADO_CANCELADO,
    motivoInterrupcion: motivo,
    fechaActualizacion: ahoraMs,
  };
}

export function avanzarFase(
  sesion: SesionTemporizador,
  cicloActual: number,
  config: ConfiguracionTemporizador
): { sesion: SesionTemporizador; siguienteCiclo: number } {
  const siguienteFase = determinarSiguienteFase(
    sesion.fase,
    cicloActual,
    config.ciclosAntesDescansoLargo
  );
  const siguienteCiclo =
    siguienteFase === FASE_TRABAJO ? cicloActual + 1 : cicloActual;

  const nuevaSesion = crearSesionInicial(siguienteFase, config, sesion.tareaId);
  nuevaSesion.id = sesion.id;

  return { sesion: nuevaSesion, siguienteCiclo };
}

export function recuperarSesionTrasRecarga(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): SesionTemporizador {
  if (
    sesion.estado !== ESTADO_ACTIVO ||
    !sesion.tiempoFinObjetivo ||
    !sesion.tiempoInicio
  ) {
    return sesion;
  }

  const tiempoTotalPausado = sesion.tiempoTotalPausadoSegundos;
  const transcurridoSegundos =
    (ahoraMs -
      sesion.tiempoInicio -
      tiempoTotalPausado * 1000) /
    1000;
  const duracionReal = Math.min(
    sesion.duracionPrevistaSegundos,
    Math.floor(sesion.duracionRealSegundos + transcurridoSegundos)
  );
  const restante = sesion.duracionPrevistaSegundos - duracionReal;

  if (restante <= 0) {
    return {
      ...sesion,
      estado: ESTADO_COMPLETADO,
      completada: true,
      duracionRealSegundos: sesion.duracionPrevistaSegundos,
      fechaActualizacion: ahoraMs,
    };
  }

  const tiempoFinObjetivo = ahoraMs + restante * 1000;

  return {
    ...sesion,
    estado: ESTADO_ACTIVO,
    tiempoInicio: ahoraMs,
    tiempoFinObjetivo,
    duracionRealSegundos: duracionReal,
    fechaActualizacion: ahoraMs,
  };
}

export function yaPasoElTiempoObjetivo(
  sesion: SesionTemporizador,
  ahoraMs: number = Date.now()
): boolean {
  if (!sesion.tiempoFinObjetivo || sesion.estado !== ESTADO_ACTIVO) {
    return false;
  }
  return ahoraMs >= sesion.tiempoFinObjetivo;
}
