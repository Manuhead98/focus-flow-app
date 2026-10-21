export interface Nota {
  id: string;
  contenido: string;
  tareaId: string | null;
  fechaCreacion: number;
  fechaActualizacion: number;
}

export interface NotaInput {
  contenido: string;
  tareaId?: string | null;
}

export const STORAGE_KEY = 'focus-flow-notas';

export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function crearNota(input: NotaInput, ahoraMs: number = Date.now()): Nota {
  return {
    id: generarId(),
    contenido: input.contenido.trim(),
    tareaId: input.tareaId ?? null,
    fechaCreacion: ahoraMs,
    fechaActualizacion: ahoraMs,
  };
}

export function formatearFecha(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function validarNotaInput(contenido: string): string[] {
  const errores: string[] = [];
  if (!contenido || contenido.trim().length === 0) {
    errores.push('El contenido no puede estar vacío');
  }
  if (contenido.length > 5000) {
    errores.push('El contenido no puede exceder los 5000 caracteres');
  }
  return errores;
}
