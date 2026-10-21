import type { Tarea } from './types';
import { COLOR_ESTADO, COLOR_PRIORIDAD, ESTADO_LABEL, PRIORIDAD_LABEL } from './types';

interface TaskItemProps {
  tarea: Tarea;
  onCompletar: (id: string) => void;
  onArchivar: (id: string) => void;
  onEliminar: (id: string) => void;
  onSeleccionar: (id: string) => void;
  seleccionada: boolean;
}

export function TaskItem({
  tarea,
  onCompletar,
  onArchivar,
  onEliminar,
  onSeleccionar,
  seleccionada,
}: TaskItemProps) {
  const manejarClick = () => {
    onSeleccionar(tarea.id);
  };

  return (
    <div
      onClick={manejarClick}
      role="button"
      tabIndex={0}
      className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
        seleccionada ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${COLOR_ESTADO[tarea.estado]}`}>
            {ESTADO_LABEL[tarea.estado]}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${COLOR_PRIORIDAD[tarea.prioridad]}`}>
            {PRIORIDAD_LABEL[tarea.prioridad]}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompletar(tarea.id);
            }}
            className="p-1.5 rounded text-emerald-600 hover:bg-emerald-50"
            title="Completar"
          >
            ✓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchivar(tarea.id);
            }}
            className="p-1.5 rounded text-slate-500 hover:bg-slate-50"
            title="Archivar"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(tarea.id);
            }}
            className="p-1.5 rounded text-rose-600 hover:bg-rose-50"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className={`text-lg font-semibold ${seleccionada ? 'text-indigo-700' : 'text-slate-900'}`}>
        {tarea.titulo}
      </h3>

      {tarea.descripcion && (
        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{tarea.descripcion}</p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">🍅 {tarea.pomodorosCompletados}/{tarea.objetivoPomodoros}</span>
        {tarea.fechaPlanificacion && (
          <span className="flex items-center gap-1">📅 {tarea.fechaPlanificacion}</span>
        )}
      </div>
    </div>
  );
}
