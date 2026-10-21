import { useState } from 'react';
import type { NotaInput } from './types';

interface NoteFormProps {
  onSubmit: (input: NotaInput) => void;
  notaEditar?: NotaInput | null;
}

export function NoteForm({ onSubmit = () => {}, notaEditar }: NoteFormProps) {
  const [contenido, setContenido] = useState(notaEditar?.contenido ?? '');

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ contenido, tareaId: notaEditar?.tareaId ?? null });
  };

  return (
    <form onSubmit={manejarSubmit} className="space-y-3">
      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
        placeholder="Escribe una nota rápida..."
      />
      <button
        type="submit"
        className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        {notaEditar ? 'Guardar nota' : 'Crear nota'}
      </button>
    </form>
  );
}
