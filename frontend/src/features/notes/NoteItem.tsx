import type { Nota } from './types';

interface NoteItemProps {
  nota: Nota;
  onEditar: (id: string, contenido: string) => void;
  onEliminar: (id: string) => void;
}

export function NoteItem({ nota, onEditar, onEliminar }: NoteItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-400">
          {nota.fechaActualizacion ? new Date(nota.fechaActualizacion).toLocaleString('es-ES') : ''}
        </span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar(nota.id, nota.contenido);
            }}
            className="p-1.5 rounded text-indigo-600 hover:bg-indigo-50"
            title="Editar"
          >
            ✎
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(nota.id);
            }}
            className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{nota.contenido}</p>

      {nota.tareaId && (
        <span className="mt-2 inline-block text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          Vinculada a tarea
        </span>
      )}
    </div>
  );
}
