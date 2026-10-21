import { useState } from 'react';
import { Timer } from './features/timer/Timer';
import { TaskList } from './features/tasks/TaskList';

export default function App() {
  const [tareaSeleccionadaId, setTareaSeleccionadaId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-xl tracking-tight">Focus Flow</span>
          <div className="flex gap-3">
            <button className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100">
              Iniciar sesión
            </button>
            <button className="px-4 py-1.5 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">
              Crear cuenta
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Bienvenido a Focus Flow</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Timer tareaId={tareaSeleccionadaId} />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Tareas
              </h2>
              <TaskList onTareaSeleccionada={setTareaSeleccionadaId} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
