import type { Tarea, TareaInput, FiltrosTareas, EstadoTarea } from './types';
import { crearTarea, STORAGE_KEY } from './types';

export { crearTarea, STORAGE_KEY };

export function filtrarTareas(tareas: Tarea[], filtros: FiltrosTareas): Tarea[] {
  return tareas.filter((t) => {
    if (t.archivada) return false;
    if (filtros.estado && t.estado !== filtros.estado) return false;
    if (filtros.prioridad && t.prioridad !== filtros.prioridad) return false;
    if (filtros.busqueda) {
      const q = filtros.busqueda.toLowerCase();
      if (!t.titulo.toLowerCase().includes(q) && !t.descripcion.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });
}

export function ordenarTareas(tareas: Tarea[]): Tarea[] {
  return [...tareas].sort((a, b) => {
    const estadoOrden: Record<EstadoTarea, number> = {
      pendiente: 0,
      enProgreso: 1,
      completada: 2,
      archivada: 3,
    };
    const oa = estadoOrden[a.estado];
    const ob = estadoOrden[b.estado];
    if (oa !== ob) return oa - ob;
    return b.fechaActualizacion - a.fechaActualizacion;
  });
}

export function actualizarTarea(
  tarea: Tarea,
  cambios: Partial<Pick<Tarea, 'titulo' | 'descripcion' | 'prioridad' | 'fechaPlanificacion' | 'objetivoPomodoros'>>,
  ahoraMs: number = Date.now()
): Tarea {
  return {
    ...tarea,
    ...cambios,
    fechaActualizacion: ahoraMs,
  };
}

export function cambiarEstadoTarea(
  tarea: Tarea,
  estado: EstadoTarea,
  ahoraMs: number = Date.now()
): Tarea {
  return {
    ...tarea,
    estado,
    fechaActualizacion: ahoraMs,
    archivada: estado === 'archivada',
  };
}

export function incrementarPomodorosCompletados(
  tarea: Tarea,
  ahoraMs: number = Date.now()
): Tarea {
  return {
    ...tarea,
    pomodorosCompletados: tarea.pomodorosCompletados + 1,
    tiempoAcumuladoSegundos: tarea.tiempoAcumuladoSegundos + 25 * 60,
    fechaActualizacion: ahoraMs,
  };
}

export function sumarTiempoSesion(
  tarea: Tarea,
  segundos: number,
  ahoraMs: number = Date.now()
): Tarea {
  return {
    ...tarea,
    tiempoAcumuladoSegundos: tarea.tiempoAcumuladoSegundos + segundos,
    fechaActualizacion: ahoraMs,
  };
}

export function validarTareaInput(input: TareaInput): string[] {
  const errores: string[] = [];
  if (!input.titulo || input.titulo.trim().length === 0) {
    errores.push('El título es obligatorio');
  }
  if (input.titulo.trim().length > 200) {
    errores.push('El título no puede exceder los 200 caracteres');
  }
  if (input.descripcion && input.descripcion.length > 1000) {
    errores.push('La descripción no puede exceder los 1000 caracteres');
  }
  if (
    input.objetivoPomodoros !== undefined &&
    (input.objetivoPomodoros < 1 || input.objetivoPomodoros > 50)
  ) {
    errores.push('El objetivo de Pomodoros debe estar entre 1 y 50');
  }
  return errores;
}
