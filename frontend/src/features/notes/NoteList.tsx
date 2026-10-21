import React from 'react';
import type { NotaInput } from './types';
import { NoteForm } from './NoteForm';
import { NoteItem } from './NoteItem';
import { useNotes } from './useNotes';

export function NoteList() {
  const {
    notas,
    notasFiltradas,
    filtroTareaActual,
    agregarNota,
    editarNota,
    eliminarNota,
    limpiarFiltro,
  } = useNotes();

  const [abrirForm, setAbrirForm] = React.useState(false);
  const [notaEditandoId, setNotaEditandoId] = React.useState<string | null>(null);
  const [contenidoEdicion, setContenidoEdicion] = React.useState('');

  const notaEditando = notas.find((n) => n.id === notaEditandoId);

  const manejarAgregar = (input: NotaInput) => {
    agregarNota(input);
    setAbrirForm(false);
  };

  const manejarEditar = (id: string, contenido: string) => {
    setNotaEditandoId(id);
    setContenidoEdicion(contenido);
    setAbrirForm(true);
  };

  const manejarGuardar = () => {
    if (notaEditandoId && notaEditando) {
      editarNota(notaEditandoId, { contenido: contenidoEdicion });
    }
    setAbrirForm(false);
    setNotaEditandoId(null);
    setContenidoEdicion('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">Notas rápidas</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setNotaEditandoId(null);
              setContenidoEdicion('');
              setAbrirForm(true);
            }}
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            + Nueva nota
          </button>
          {filtroTareaActual && (
            <button
              onClick={limpiarFiltro}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notasFiltradas.length === 0 ? (
          <div className="sm:col-span-2 flex flex-col items-center justify-center py-12 text-slate-500">
            <p>No hay notas.</p>
          </div>
        ) : (
          notasFiltradas.map((nota) => (
            <NoteItem
              key={nota.id}
              nota={nota}
              onEditar={manejarEditar}
              onEliminar={eliminarNota}
            />
          ))
        )}
      </div>

      {abrirForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <NoteForm
            onSubmit={manejarAgregar}
            notaEditar={notaEditando ? { contenido: notaEditando.contenido, tareaId: notaEditando.tareaId } : null}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={manejarGuardar}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
