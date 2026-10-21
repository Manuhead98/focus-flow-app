import { Play, Pause, SkipForward, RefreshCw, X, Speaker } from 'lucide-react';
import type { FasePomodoro } from './types';
import { useTimer } from './useTimer';
import { COLOR_FASE, LABEL_FASE } from './constants';

interface TimerProps {
  faseInicial?: FasePomodoro;
  cicloInicial?: number;
  tareaId?: string | null;
}

export function Timer({
  faseInicial = 'trabajo',
  cicloInicial = 0,
  tareaId = null,
}: TimerProps) {
  const {
    configuracion,
    cicloActual,
    tiempoRestanteFormateado,
    progresoPorcentaje,
    faseActual,
    estaInactivo,
    estaCompletado,
    estaPausado,
    iniciar,
    pausar,
    reanudar,
    reiniciar,
    cancelar,
    avanzarFaseManual,
  } = useTimer(faseInicial, cicloInicial);

  const colorFase = COLOR_FASE[faseActual as keyof typeof COLOR_FASE];

  const manejarClickIniciar = () => {
    if (estaCompletado) {
      reiniciar();
    } else {
      iniciar(tareaId);
    }
  };

  const manejarCancelar = () => {
    cancelar();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] relative">
            <div className="relative w-64 h-64">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 240 240"
              >
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  fill="none"
                  className="transition-colors duration-300"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="100"
                  stroke={colorFase}
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                  style={{
                    strokeDasharray: '628',
                    strokeDashoffset: 628 - (628 * Math.min(100, progresoPorcentaje)) / 100,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-mono font-bold text-slate-900">
                  {tiempoRestanteFormateado}
                </span>
                <span className="mt-2 text-sm font-medium text-slate-500 capitalize">
                  {LABEL_FASE[faseActual as keyof typeof LABEL_FASE]}
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Ciclo {cicloActual + 1}
                </span>
              </div>
            </div>

            <div className="mt-6 w-full max-w-xs">
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: colorFase,
                    width: `${Math.min(100, progresoPorcentaje)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1 text-center">
                {Math.min(100, progresoPorcentaje)}% de la fase
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {estaInactivo || estaCompletado ? (
              <button
                onClick={manejarClickIniciar}
                className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transform transition hover:scale-[1.02] active:scale-95 flex items-center gap-2 ${
                  estaCompletado ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {estaCompletado ? (
                  <>
                    <RefreshCw className="w-5 h-5" /> Reiniciar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> Iniciar
                  </>
                )}
              </button>
            ) : estaPausado ? (
              <>
                <button
                  onClick={reanudar}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition flex items-center gap-2"
                >
                  <Play className="w-5 h-5" /> Reanudar
                </button>
                <button
                  onClick={reiniciar}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-slate-600 hover:bg-slate-700 shadow transition"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={pausar}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow transition flex items-center gap-2"
                >
                  <Pause className="w-5 h-5" /> Pausa
                </button>
                <button
                  onClick={manejarCancelar}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow transition flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}

            {!estaInactivo && !estaCompletado && (
              <button
                onClick={avanzarFaseManual}
                className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow transition flex items-center gap-2"
              >
                <SkipForward className="w-5 h-5" /> Siguiente fase
              </button>
            )}

            <button
              className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 shadow transition flex items-center gap-2"
            >
              <Speaker className="w-5 h-5" />
              {configuracion.sonidoHabilitado ? 'Sonido: ON' : 'Sonido: OFF'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${colorFase}`} />
              Configuración actual
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Trabajo</span>
                <span className="font-medium">{configuracion.trabajoMinutos} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Descanso corto</span>
                <span className="font-medium">{configuracion.descansoCortoMinutos} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Descanso largo</span>
                <span className="font-medium">{configuracion.descansoLargoMinutos} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ciclos antes descanso largo</span>
                <span className="font-medium">{configuracion.ciclosAntesDescansoLargo}</span>
              </div>
            </div>
          </div>

          {estaCompletado && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
              <h4 className="text-sm font-semibold text-indigo-800 mb-1">
                ¡Fase completada!
              </h4>
              <p className="text-xs text-indigo-700">
                La sesión de {LABEL_FASE[faseActual as keyof typeof LABEL_FASE]} ha finalizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
