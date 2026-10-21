import type { TareaInput } from './types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio').max(200, 'Máximo 200 caracteres'),
  descripcion: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  prioridad: z.enum(['baja', 'media', 'alta']),
  fechaPlanificacion: z.string().nullable(),
  objetivoPomodoros: z.coerce.number().min(1).max(50),
});

type FormData = z.infer<typeof schema>;

interface TaskFormProps {
  onSubmit: (input: TareaInput) => void;
  tareaEditar?: TareaInput | null;
}

export function TaskForm({ onSubmit, tareaEditar }: TaskFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      titulo: tareaEditar?.titulo ?? '',
      descripcion: tareaEditar?.descripcion ?? '',
      prioridad: tareaEditar?.prioridad ?? 'media',
      fechaPlanificacion: tareaEditar?.fechaPlanificacion ?? null,
      objetivoPomodoros: tareaEditar?.objetivoPomodoros ?? 1,
    },
  });

  const errores = form.formState.errors;

  const manejarSubmit = form.handleSubmit((data) => {
    const resultado = schema.safeParse(data);
    if (!resultado.success) {
      return;
    }
    onSubmit({
      titulo: resultado.data.titulo,
      descripcion: resultado.data.descripcion,
      prioridad: resultado.data.prioridad,
      fechaPlanificacion: resultado.data.fechaPlanificacion,
      objetivoPomodoros: resultado.data.objetivoPomodoros,
    });
  });

  return (
    <form onSubmit={manejarSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Título
        </label>
        <input
          {...form.register('titulo')}
          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Ej: Escribir reporte semanal"
        />
        {errores.titulo && (
          <p className="text-xs text-rose-600 mt-1">{errores.titulo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          {...form.register('descripcion')}
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Detalles adicionales..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Prioridad
          </label>
          <select
            {...form.register('prioridad')}
            className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Fecha planificada
          </label>
          <input
            type="date"
            {...form.register('fechaPlanificacion')}
            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Objetivo de Pomodoros
        </label>
        <input
          type="number"
          min="1"
          max="50"
          {...form.register('objetivoPomodoros')}
          className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
      >
        {tareaEditar ? 'Guardar cambios' : 'Crear tarea'}
      </button>
    </form>
  );
}
