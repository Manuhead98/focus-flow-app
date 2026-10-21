import { useCallback, useEffect, useState } from 'react';
import type {
  ConfiguracionTemporizador,
  SesionTemporizador,
} from './types';
import {
  CONFIGURACION_POR_DEFECTO,
  ESTADO_ACTIVO,
  ESTADO_COMPLETADO,
  ESTADO_INACTIVO,
  ESTADO_PAUSADO,
  avanzarFase,
  completarSesion,
  crearSesionInicial,
  iniciarSesion,
  pausarSesion,
  reanudarSesion,
  recuperarSesionTrasRecarga,
  reiniciarSesion,
  cancelarSesion,
  formatearTiempo,
} from './timerUtils';

const STORAGE_KEY = 'focus-flow-timer-session';
const INTERVALO_TICK_MS = 1000;

export interface UseTimerReturn {
  sesion: SesionTemporizador;
  configuracion: ConfiguracionTemporizador;
  cicloActual: number;
  tiempoRestanteSegundos: number;
  tiempoRestanteFormateado: string;
  progresoPorcentaje: number;
  faseActual: string;
  estaActivo: boolean;
  estaPausado: boolean;
  estaCompletado: boolean;
  estaInactivo: boolean;
  iniciar: (tareaId?: string | null) => void;
  pausar: () => void;
  reanudar: () => void;
  reiniciar: () => void;
  completar: () => void;
  cancelar: (motivo?: string) => void;
  avanzarFaseManual: () => void;
  actualizarConfiguracion: (config: Partial<ConfiguracionTemporizador>) => void;
  recuperarEstadoPersistido: () => void;
  limpiarPersistencia: () => void;
}

export function useTimer(
  faseInicial: string = 'trabajo',
  cicloInicial: number = 0,
  configInicial?: Partial<ConfiguracionTemporizador>
): UseTimerReturn {
  const config: ConfiguracionTemporizador = {
    ...CONFIGURACION_POR_DEFECTO,
    ...configInicial,
  };

  const [sesion, setSesion] = useState<SesionTemporizador>(
    crearSesionInicial(
      faseInicial as any,
      config,
      null
    )
  );
  const [cicloActual, setCicloActual] = useState(cicloInicial);

  const calcularProgreso = useCallback((): number => {
    if (sesion.duracionPrevistaSegundos <= 0) return 0;
    const transcurrido = Math.min(
      sesion.duracionPrevistaSegundos,
      sesion.duracionRealSegundos
    );
    return Math.round((transcurrido / sesion.duracionPrevistaSegundos) * 100);
  }, [sesion]);

  const calcularTiempoRestante = useCallback((): number => {
    if (sesion.estado !== ESTADO_ACTIVO || !sesion.tiempoFinObjetivo) {
      return Math.max(0, sesion.duracionPrevistaSegundos - sesion.duracionRealSegundos);
    }
    if (!sesion.tiempoInicio) {
      return Math.max(0, sesion.duracionPrevistaSegundos - sesion.duracionRealSegundos);
    }
    const ahoraMs = Date.now();
    const transcurridoSegundos =
      (ahoraMs - sesion.tiempoInicio - sesion.tiempoTotalPausadoSegundos * 1000) / 1000;
    return Math.max(0, Math.floor(sesion.duracionPrevistaSegundos - transcurridoSegundos));
  }, [sesion]);

  const persistir = useCallback((c: number) => {
    try {
      const payload = { sesion, configuracion: config, ciclo: c };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // IndexedDB/localStorage puede no estar disponible en privado o incógnito
    }
  }, [sesion, config, cicloActual]);

  const restaurarPersistencia = useCallback((): SesionTemporizador | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const datos = JSON.parse(raw);
      if (!datos || !datos.sesion) return null;
      return datos.sesion as SesionTemporizador;
    } catch {
      return null;
    }
  }, []);

  const actualizarDesdeTick = useCallback(() => {
    setSesion((prev) => {
      if (prev.estado !== ESTADO_ACTIVO || !prev.tiempoFinObjetivo) {
        return prev;
      }

      const ahoraMs = Date.now();
      const transcurridoSegundos =
        (ahoraMs -
          prev.tiempoInicio! -
          prev.tiempoTotalPausadoSegundos * 1000) /
        1000;
      const duracionReal = Math.min(
        prev.duracionPrevistaSegundos,
        Math.floor(prev.duracionRealSegundos + transcurridoSegundos)
      );

      if (duracionReal === prev.duracionRealSegundos) {
        return prev;
      }

      const siguiente = {
        ...prev,
        duracionRealSegundos: duracionReal,
        fechaActualizacion: ahoraMs,
      };
      persistir(cicloActual);
      return siguiente;
    });
  }, [cicloActual, persistir]);

  useEffect(() => {
    if (sesion.estado === ESTADO_ACTIVO && sesion.tiempoFinObjetivo) {
      const id = window.setInterval(actualizarDesdeTick, INTERVALO_TICK_MS);
      return () => window.clearInterval(id);
    }
    return undefined;
  }, [sesion.estado, sesion.tiempoFinObjetivo, actualizarDesdeTick]);

  useEffect(() => {
    const sesionPersistida = restaurarPersistencia();
    if (sesionPersistida) {
      const sesionRecuperada = recuperarSesionTrasRecarga(sesionPersistida);
      setSesion(sesionRecuperada);
    }
  }, [restaurarPersistencia]);

  const iniciar = useCallback(
    (tareaId?: string | null) => {
      const siguiente = iniciarSesion(sesion, Date.now());
      siguiente.tareaId = tareaId ?? null;
      setSesion(siguiente);
      persistir(cicloActual);
    },
    [sesion, cicloActual, persistir]
  );

  const pausar = useCallback(() => {
    const siguiente = pausarSesion(sesion, Date.now());
    setSesion(siguiente);
    persistir(cicloActual);
  }, [sesion, cicloActual, persistir]);

  const reanudar = useCallback(() => {
    const siguiente = reanudarSesion(sesion, Date.now());
    setSesion(siguiente);
    persistir(cicloActual);
  }, [sesion, cicloActual, persistir]);

  const reiniciar = useCallback(() => {
    const siguiente = reiniciarSesion(
      sesion,
      sesion.fase,
      config,
      sesion.tareaId,
      Date.now()
    );
    setSesion(siguiente);
    setCicloActual(cicloInicial);
    persistir(cicloInicial);
  }, [sesion, config, cicloInicial, persistir]);

  const completar = useCallback(() => {
    const siguiente = completarSesion(sesion, Date.now());
    setSesion(siguiente);
    persistir(cicloActual);
  }, [sesion, cicloActual, persistir]);

  const cancelar = useCallback(
    (motivo?: string) => {
      const siguiente = cancelarSesion(
        sesion,
        motivo ?? 'cancelado por el usuario',
        Date.now()
      );
      setSesion(siguiente);
      persistir(cicloActual);
    },
    [sesion, cicloActual, persistir]
  );

  const avanzarFaseManual = useCallback(() => {
    const { sesion: siguienteSesion, siguienteCiclo } = avanzarFase(
      sesion,
      cicloActual,
      config
    );
    setSesion(siguienteSesion);
    setCicloActual(siguienteCiclo);
    persistir(siguienteCiclo);
  }, [sesion, cicloActual, config, persistir]);

  const actualizarConfiguracion = useCallback(
    (nuevaConfig: Partial<ConfiguracionTemporizador>) => {
      const siguienteConfig: ConfiguracionTemporizador = {
        ...config,
        ...nuevaConfig,
      };
      const siguienteSesion = reiniciarSesion(
        sesion,
        sesion.fase,
        siguienteConfig,
        sesion.tareaId,
        Date.now()
      );
      setSesion(siguienteSesion);
      persistir(cicloActual);
    },
    [sesion, config, cicloActual, persistir]
  );

  const recuperarEstadoPersistido = useCallback(() => {
    const sesionPersistida = restaurarPersistencia();
    if (sesionPersistida) {
      const sesionRecuperada = recuperarSesionTrasRecarga(sesionPersistida, Date.now());
      setSesion(sesionRecuperada);
    }
  }, [restaurarPersistencia]);

  const limpiarPersistencia = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setSesion(crearSesionInicial('trabajo' as any, config, null));
    setCicloActual(0);
  }, [config]);

  const tiempoRestanteSegundos = calcularTiempoRestante();
  const tiempoRestanteFormateado = formatearTiempo(tiempoRestanteSegundos);
  const progresoPorcentaje = calcularProgreso();
  const faseActual = sesion.fase;

  return {
    sesion,
    configuracion: config,
    cicloActual,
    tiempoRestanteSegundos,
    tiempoRestanteFormateado,
    progresoPorcentaje,
    faseActual,
    estaActivo: sesion.estado === ESTADO_ACTIVO,
    estaPausado: sesion.estado === ESTADO_PAUSADO,
    estaCompletado: sesion.estado === ESTADO_COMPLETADO,
    estaInactivo: sesion.estado === ESTADO_INACTIVO,
    iniciar,
    pausar,
    reanudar,
    reiniciar,
    completar,
    cancelar,
    avanzarFaseManual,
    actualizarConfiguracion,
    recuperarEstadoPersistido,
    limpiarPersistencia,
  };
}
