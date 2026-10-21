import { useCallback, useEffect, useState } from 'react';
import type { Tarea, TareaInput, FiltrosTareas } from './types';
import {
  crearTarea,
  filtrarTareas,
  ordenarTareas,
  actualizarTarea,
  cambiarEstadoTarea,
  incrementarPomodorosCompletados,
  sumarTiempoSesion,
  validarTareaInput,
  STORAGE_KEY,
} from './taskUtils';

export interface UseTasksReturn {
  tareas: Tarea[];
  filtros: FiltrosTareas;
  tareasFiltradas: Tarea[];
  agregarTarea: (input: TareaInput) => { exito: boolean; errores: string[]; tarea?: Tarea };
  editarTarea: (id: string, cambios: Partial<TareaInput>) => boolean;
  completarTarea: (id: string) => boolean;
  archivarTarea: (id: string) => boolean;
  eliminarTarea: (id: string) => boolean;
  establecerFiltros: (filtros: Partial<FiltrosTareas>) => void;
  limpiarFiltros: () => void;
  obtenerTareaPorId: (id: string) => Tarea | undefined;
  incrementarPomodoros: (id: string) => boolean;
  sumarTiempo: (id: string, segundos: number) => boolean;
  recuperarEstadoPersistido: () => void;
  limpiarPersistencia: () => void;
}

export function useTasks(): UseTasksReturn {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtros, setFiltros] = useState<FiltrosTareas>({});

  const tareasFiltradas = useCallback((): Tarea[] => {
    return ordenarTareas(filtrarTareas(tareas, filtros));
  }, [tareas, filtros]);

  const persistir = useCallback((ts: Tarea[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ts));
    } catch {
      // localStorage puede no estar disponible
    }
  }, []);

  const recuperarPersistencia = useCallback((): Tarea[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const datos = JSON.parse(raw);
      return Array.isArray(datos) ? datos : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const guardadas = recuperarPersistencia();
    if (guardadas.length > 0) {
      setTareas(guardadas);
    }
  }, [recuperarPersistencia]);

  useEffect(() => {
    persistir(tareas);
  }, [tareas, persistir]);

  const agregarTarea = useCallback(
    (input: TareaInput) => {
      const errores = validarTareaInput(input);
      if (errores.length > 0) {
        return { exito: false, errores };
      }
      const nueva = crearTarea(input);
      setTareas((prev) => {
        const siguiente = [...prev, nueva];
        persistir(siguiente);
        return siguiente;
      });
      return { exito: true, errores: [], tarea: nueva };
    },
    [persistir]
  );

  const editarTarea = useCallback(
    (id: string, cambios: Partial<TareaInput>): boolean => {
      let resultado = false;
      setTareas((prev) => {
        const siguiente = prev.map((t) => {
          if (t.id !== id) return t;
          resultado = true;
          return actualizarTarea(t, cambios);
        });
        persistir(siguiente);
        return siguiente;
      });
      return resultado;
    },
    [persistir]
  );

  const completarTarea = useCallback((id: string): boolean => {
    let resultado = false;
    setTareas((prev) => {
      const siguiente = prev.map((t) => {
        if (t.id !== id) return t;
        resultado = true;
        return cambiarEstadoTarea(t, 'completada');
      });
      persistir(siguiente);
      return siguiente;
    });
    return resultado;
  }, [persistir]);

  const archivarTarea = useCallback((id: string): boolean => {
    let resultado = false;
    setTareas((prev) => {
      const siguiente = prev.map((t) => {
        if (t.id !== id) return t;
        resultado = true;
        return cambiarEstadoTarea(t, 'archivada');
      });
      persistir(siguiente);
      return siguiente;
    });
    return resultado;
  }, [persistir]);

  const eliminarTarea = useCallback((id: string): boolean => {
    let resultado = false;
    setTareas((prev) => {
      const siguiente = prev.filter((t) => {
        if (t.id === id) {
          resultado = true;
          return false;
        }
        return true;
      });
      persistir(siguiente);
      return siguiente;
    });
    return resultado;
  }, [persistir]);

  const establecerFiltros = useCallback((nuevosFiltros: Partial<FiltrosTareas>) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({});
  }, []);

  const obtenerTareaPorId = useCallback(
    (id: string): Tarea | undefined => {
      return tareas.find((t) => t.id === id);
    },
    [tareas]
  );

  const incrementarPomodoros = useCallback((id: string): boolean => {
    let resultado = false;
    setTareas((prev) => {
      const siguiente = prev.map((t) => {
        if (t.id !== id) return t;
        resultado = true;
        return incrementarPomodorosCompletados(t);
      });
      persistir(siguiente);
      return siguiente;
    });
    return resultado;
  }, [persistir]);

  const sumarTiempo = useCallback((id: string, segundos: number): boolean => {
    let resultado = false;
    setTareas((prev) => {
      const siguiente = prev.map((t) => {
        if (t.id !== id) return t;
        resultado = true;
        return sumarTiempoSesion(t, segundos);
      });
      persistir(siguiente);
      return siguiente;
    });
    return resultado;
  }, [persistir]);

  const recuperarEstadoPersistido = useCallback(() => {
    const guardadas = recuperarPersistencia();
    if (guardadas.length > 0) {
      setTareas(guardadas);
    }
  }, [recuperarPersistencia]);

  const limpiarPersistencia = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setTareas([]);
  }, []);

  return {
    tareas,
    filtros,
    tareasFiltradas: tareasFiltradas(),
    agregarTarea,
    editarTarea,
    completarTarea,
    archivarTarea,
    eliminarTarea,
    establecerFiltros,
    limpiarFiltros,
    obtenerTareaPorId,
    incrementarPomodoros,
    sumarTiempo,
    recuperarEstadoPersistido,
    limpiarPersistencia,
  };
}
