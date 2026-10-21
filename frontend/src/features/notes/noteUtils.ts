import type { Nota } from './types';
import { STORAGE_KEY } from './types';

export { STORAGE_KEY };

export function filtrarNotasPorTarea(notas: Nota[], tareaId: string | null): Nota[] {
  if (!tareaId) return notas;
  return notas.filter((n) => n.tareaId === tareaId);
}

export function actualizarNota(
  nota: Nota,
  cambios: Partial<Pick<Nota, 'contenido' | 'tareaId'>>,
  ahoraMs: number = Date.now()
): Nota {
  return {
    ...nota,
    ...cambios,
    fechaActualizacion: ahoraMs,
  };
}
