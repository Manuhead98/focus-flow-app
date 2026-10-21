import { Timer } from './features/timer/Timer';

export default function App() {
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

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Bienvenido a Focus Flow</h1>
        <Timer />
      </main>
    </div>
  );
}
