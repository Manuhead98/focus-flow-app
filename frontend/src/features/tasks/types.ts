export type EstadoTarea = 'pendiente' | 'enProgreso' | 'completada' | 'archivada';
export type PrioridadTarea = 'baja' | 'media' | 'alta';

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoTarea;
  prioridad: PrioridadTarea;
  fechaPlanificacion: string | null;
  objetivoPomodoros: number;
  pomodorosCompletados: number;
  tiempoAcumuladoSegundos: number;
  fechaCreacion: number;
  fechaActualizacion: number;
  archivada: boolean;
}

export interface TareaInput {
  titulo: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fechaPlanificacion?: string | null;
  objetivoPomodoros?: number;
}

export interface FiltrosTareas {
  estado?: EstadoTarea;
  prioridad?: PrioridadTarea;
  busqueda?: string;
}

export const ESTADO_PENDIENTE: EstadoTarea = 'pendiente';
export const ESTADO_EN_PROGRESO: EstadoTarea = 'enProgreso';
export const ESTADO_COMPLETADA: EstadoTarea = 'completada';
export const ESTADO_ARCHIVADA: EstadoTarea = 'archivada';

export const PRIORIDAD_BAJA: PrioridadTarea = 'baja';
export const PRIORIDAD_MEDIA: PrioridadTarea = 'media';
export const PRIORIDAD_ALTA: PrioridadTarea = 'alta';

export const STORAGE_KEY = 'focus-flow-tareas';

export const ESTADO_LABEL: Record<EstadoTarea, string> = {
  pendiente: 'Pendiente',
  enProgreso: 'En progreso',
  completada: 'Completada',
  archivada: 'Archivada',
};

export const PRIORIDAD_LABEL: Record<PrioridadTarea, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};

export const COLOR_PRIORIDAD: Record<PrioridadTarea, string> = {
  baja: 'bg-slate-100 text-slate-600 border-slate-200',
  media: 'bg-amber-100 text-amber-700 border-amber-200',
  alta: 'bg-rose-100 text-rose-700 border-rose-200',
};

export const COLOR_ESTADO: Record<EstadoTarea, string> = {
  pendiente: 'bg-slate-100 text-slate-600',
  enProgreso: 'bg-indigo-100 text-indigo-700',
  completada: 'bg-emerald-100 text-emerald-700',
  archivada: 'bg-slate-100 text-slate-400',
};

export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function tareaVacia(): TareaInput {
  return {
    titulo: '',
    descripcion: '',
    prioridad: PRIORIDAD_MEDIA,
    fechaPlanificacion: null,
    objetivoPomodoros: 1,
  };
}

export function crearTarea(input: TareaInput, ahoraMs: number = Date.now()): Tarea {
  return {
    id: generarId(),
    titulo: input.titulo.trim(),
    descripcion: (input.descripcion ?? '').trim(),
    estado: ESTADO_PENDIENTE,
    prioridad: input.prioridad ?? PRIORIDAD_MEDIA,
    fechaPlanificacion: input.fechaPlanificacion ?? null,
    objetivoPomodoros: input.objetivoPomodoros ?? 1,
    pomodorosCompletados: 0,
    tiempoAcumuladoSegundos: 0,
    fechaCreacion: ahoraMs,
    fechaActualizacion: ahoraMs,
    archivada: false,
  };
}

export function formatearFecha(iso: string | null): string {
  if (!iso) return '';
  const fecha = new Date(iso);
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
