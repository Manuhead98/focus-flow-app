import type { FasePomodoro } from './types';

export const LABEL_FASE: Record<FasePomodoro, string> = {
  trabajo: 'Trabajo',
  descansoCorto: 'Descanso corto',
  descansoLargo: 'Descanso largo',
};

export const COLOR_FASE: Record<FasePomodoro, string> = {
  trabajo: 'bg-indigo-600',
  descansoCorto: 'bg-emerald-500',
  descansoLargo: 'bg-rose-500',
};
