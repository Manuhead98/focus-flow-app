import { useCallback, useEffect, useState } from 'react';
import type { Nota, NotaInput } from './types';
import { crearNota, validarNotaInput, STORAGE_KEY } from './types';
import { filtrarNotasPorTarea, actualizarNota } from './noteUtils';

export interface UseNotesReturn {
  notas: Nota[];
  notasFiltradas: Nota[];
  filtrarPorTarea: (tareaId: string | null) => void;
  filtroTareaActual: string | null;
  agregarNota: (input: NotaInput) => { exito: boolean; errores: string[]; nota?: Nota };
  editarNota: (id: string, cambios: Partial<NotaInput>) => boolean;
  eliminarNota: (id: string) => boolean;
  limpiarFiltro: () => void;
  recuperarEstadoPersistido: () => void;
  limpiarPersistencia: () => void;
}

export function useNotes(): UseNotesReturn {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filtroTareaActual, setFiltroTareaActual] = useState<string | null>(null);

  const notasFiltradas = filtrarNotasPorTarea(notas, filtroTareaActual);

  const persistir = useCallback((ns: Nota[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ns));
    } catch {
      // localStorage puede no estar disponible
    }
  }, []);

  const recuperarPersistencia = useCallback((): Nota[] => {
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
      setNotas(guardadas);
    }
  }, [recuperarPersistencia]);

  useEffect(() => {
    persistir(notas);
  }, [notas, persistir]);

  const agregarNota = useCallback(
    (input: NotaInput) => {
      const errores = validarNotaInput(input.contenido);
      if (errores.length > 0) {
        return { exito: false, errores };
      }
      const nueva = crearNota(input);
      setNotas((prev) => {
        const siguiente = [nueva, ...prev];
        persistir(siguiente);
        return siguiente;
      });
      return { exito: true, errores: [], nota: nueva };
    },
    [persistir]
  );

  const editarNota = useCallback(
    (id: string, cambios: Partial<NotaInput>): boolean => {
      let resultado = false;
      setNotas((prev) => {
        const siguiente = prev.map((n) => {
          if (n.id !== id) return n;
          resultado = true;
          return actualizarNota(n, {
            contenido: cambios.contenido ?? n.contenido,
            tareaId: cambios.tareaId ?? null,
          });
        });
        persistir(siguiente);
        return siguiente;
      });
      return resultado;
    },
    [persistir]
  );

  const eliminarNota = useCallback((id: string): boolean => {
    let resultado = false;
    setNotas((prev) => {
      const siguiente = prev.filter((n) => {
        if (n.id === id) {
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

  const limpiarFiltro = useCallback(() => {
    setFiltroTareaActual(null);
  }, []);

  const recuperarEstadoPersistido = useCallback(() => {
    const guardadas = recuperarPersistencia();
    if (guardadas.length > 0) {
      setNotas(guardadas);
    }
  }, [recuperarPersistencia]);

  const limpiarPersistencia = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    setNotas([]);
  }, []);

  return {
    notas,
    notasFiltradas,
    filtrarPorTarea: setFiltroTareaActual,
    filtroTareaActual,
    agregarNota,
    editarNota,
    eliminarNota,
    limpiarFiltro,
    recuperarEstadoPersistido,
    limpiarPersistencia,
  };
}
