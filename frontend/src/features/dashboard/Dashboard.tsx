import { Timer } from '../timer/Timer';
import { TaskList } from '../tasks/TaskList';
import { NoteList } from '../notes/NoteList';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hoy</h2>
            <p className="text-sm text-slate-500 mt-1">
              Organiza tu jornada y registra tu tiempo de concentración.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
              Iniciar sesión
            </button>
            <button className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-100">
              Crear cuenta
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Timer />
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              Tareas
            </h3>
            <TaskList />
          </section>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <NoteList />
          </section>
        </div>
      </div>
    </div>
  );
}
