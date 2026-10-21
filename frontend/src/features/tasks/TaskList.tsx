import React from 'react';
import type { TareaInput } from './types';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { useTasks } from './useTasks';
import { filtrosPorEstado, filtrosPorPrioridad } from './filtrosUI';

interface TaskListProps {
  onTareaSeleccionada?: (id: string) => void;
}

export function TaskList({ onTareaSeleccionada }: TaskListProps = {}) {
  const {
    tareasFiltradas,
    filtros,
    agregarTarea,
    editarTarea,
    completarTarea,
    archivarTarea,
    eliminarTarea,
    establecerFiltros,
    limpiarFiltros,
    obtenerTareaPorId,
  } = useTasks();

  const [tareaSeleccionadaId, setTareaSeleccionadaId] = React.useState<string | null>(null);
  const [abrirForm, setAbrirForm] = React.useState(false);
  const [modoEdicion, setModoEdicion] = React.useState(false);
  const [tareaEditando, setTareaEditando] = React.useState<TareaInput | null>(null);

  const tareaSeleccionada = tareaSeleccionadaId ? obtenerTareaPorId(tareaSeleccionadaId) : undefined;

  const manejarGuardar = (input: TareaInput) => {
    if (modoEdicion && tareaSeleccionadaId) {
      editarTarea(tareaSeleccionadaId, input);
    } else {
      agregarTarea(input);
    }
    setAbrirForm(false);
    setTareaEditando(null);
    setModoEdicion(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setModoEdicion(false);
                setTareaEditando(null);
                setAbrirForm(true);
              }}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
            >
              + Nueva tarea
            </button>

          <button
            onClick={limpiarFiltros}
            className="px-3 py-2 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filtrosPorEstado.map((estado) => (
            <button
              key={estado}
              onClick={() => establecerFiltros({ estado })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filtros.estado === estado
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {estado}
            </button>
          ))}
          {filtrosPorPrioridad.map((p) => (
            <button
              key={p}
              onClick={() => establecerFiltros({ prioridad: p })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filtros.prioridad === p
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tareasFiltradas.length === 0 ? (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-12 text-slate-500">
            <p>No hay tareas que coincidan con los filtros.</p>
          </div>
        ) : (
          tareasFiltradas.map((tarea) => (
            <TaskItem
              key={tarea.id}
              tarea={tarea}
              seleccionada={tarea.id === tareaSeleccionadaId}
              onCompletar={(id) => completarTarea(id)}
              onArchivar={(id) => archivarTarea(id)}
              onEliminar={(id) => eliminarTarea(id)}
              onSeleccionar={(id) => {
                setTareaSeleccionadaId(id);
                onTareaSeleccionada?.(id);
              }}
            />
          ))
        )}
      </div>

      {abrirForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <TaskForm
            onSubmit={manejarGuardar}
            tareaEditar={modoEdicion ? tareaEditando : undefined}
          />
        </div>
      )}

      {tareaSeleccionada && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Tarea vinculada al temporizador
          </h3>
          <p className="text-sm text-slate-600">{tareaSeleccionada.titulo}</p>
          <button
            onClick={() => setTareaSeleccionadaId(null)}
            className="mt-3 text-xs text-indigo-600 hover:underline"
          >
            Desvincular
          </button>
        </div>
      )}
    </div>
  );
}
