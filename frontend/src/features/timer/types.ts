export type FasePomodoro = 'trabajo' | 'descansoCorto' | 'descansoLargo';

export type EstadoTemporizador =
  | 'inactivo'
  | 'activo'
  | 'pausado'
  | 'completado'
  | 'cancelado'
  | 'interrumpido';

export interface ConfiguracionTemporizador {
  trabajoMinutos: number;
  descansoCortoMinutos: number;
  descansoLargoMinutos: number;
  ciclosAntesDescansoLargo: number;
  sonidoHabilitado: boolean;
  notificacionHabilitada: boolean;
}

export interface SesionTemporizador {
  id: string;
  fase: FasePomodoro;
  estado: EstadoTemporizador;
  duracionPrevistaSegundos: number;
  tiempoInicio: number | null;
  tiempoFinObjetivo: number | null;
  tiempoPausadoEn: number | null;
  tiempoTotalPausadoSegundos: number;
  duracionRealSegundos: number;
  tareaId: string | null;
  completada: boolean;
  motivoInterrupcion: string | null;
  fechaCreacion: number;
  fechaActualizacion: number;
}

export interface EstadoTemporizadorPersistido {
  sesion: SesionTemporizador;
  configuracion: ConfiguracionTemporizador;
  cicloActual: number;
}

export const CONFIGURACION_POR_DEFECTO: ConfiguracionTemporizador = {
  trabajoMinutos: 25,
  descansoCortoMinutos: 5,
  descansoLargoMinutos: 15,
  ciclosAntesDescansoLargo: 4,
  sonidoHabilitado: true,
  notificacionHabilitada: false,
};
