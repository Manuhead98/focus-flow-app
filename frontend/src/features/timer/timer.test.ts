import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  crearSesionInicial,
  iniciarSesion,
  pausarSesion,
  reanudarSesion,
  reiniciarSesion,
  completarSesion,
  cancelarSesion,
  avanzarFase,
  recuperarSesionTrasRecarga,
  yaPasoElTiempoObjetivo,
  calcularTiempoRestanteSegundos,
  determinarSiguienteFase,
  duracionParaFase,
  formatearTiempo,
  CONFIGURACION_POR_DEFECTO,
} from './timerUtils';


const config = CONFIGURACION_POR_DEFECTO;

describe('temporizador pomodoro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z').getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('crearSesionInicial', () => {
    it('debe crear una sesión inactiva con la duración prevista correcta', () => {
      const sesion = crearSesionInicial('trabajo', config, 'tarea-1');

      expect(sesion.estado).toBe('inactivo');
      expect(sesion.fase).toBe('trabajo');
      expect(sesion.duracionPrevistaSegundos).toBe(25 * 60);
      expect(sesion.tareaId).toBe('tarea-1');
      expect(sesion.completada).toBe(false);
      expect(sesion.tiempoInicio).toBeNull();
      expect(sesion.tiempoFinObjetivo).toBeNull();
    });

    it('debe calcular duración de descanso corto', () => {
      const sesion = crearSesionInicial('descansoCorto', config);
      expect(sesion.duracionPrevistaSegundos).toBe(5 * 60);
    });

    it('debe calcular duración de descanso largo', () => {
      const sesion = crearSesionInicial('descansoLargo', config);
      expect(sesion.duracionPrevistaSegundos).toBe(15 * 60);
    });
  });

  describe('iniciarSesion', () => {
    it('debe marcar la sesión como activa y establecer tiempo de fin objetivo', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);

      expect(iniciada.estado).toBe('activo');
      expect(iniciada.tiempoInicio).toBe(Date.now());
      expect(iniciada.tiempoFinObjetivo).toBeGreaterThan(Date.now());
    });

    it('no debe iniciar si ya está activa', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const duplicada = iniciarSesion(iniciada);

      expect(duplicada.estado).toBe('activo');
      expect(duplicada.tiempoInicio).toBe(iniciada.tiempoInicio);
    });
  });

  describe('pausarSesion', () => {
    it('debe pausar una sesión activa y acumular tiempo transcurrido', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);

      vi.advanceTimersByTime(60_000);
      const pausada = pausarSesion(iniciada, Date.now());

      expect(pausada.estado).toBe('pausado');
      expect(pausada.duracionRealSegundos).toBeGreaterThan(0);
      expect(pausada.tiempoPausadoEn).toBe(Date.now());
    });

    it('no debe pausar si ya está pausada', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const pausada = pausarSesion(iniciada, Date.now());
      const duplicada = pausarSesion(pausada, Date.now());

      expect(duplicada.estado).toBe('pausado');
    });
  });

  describe('reanudarSesion', () => {
    it('debe reanudar una sesión pausada recalculando el tiempo objetivo', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(30_000);
      const pausada = pausarSesion(iniciada, Date.now());

      vi.advanceTimersByTime(10_000);
      const reanudada = reanudarSesion(pausada, Date.now());

      expect(reanudada.estado).toBe('activo');
      expect(reanudada.tiempoPausadoEn).toBeNull();
      expect(reanudada.tiempoFinObjetivo).toBeGreaterThan(Date.now());
    });

    it('no debe reanudar si no está pausada', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const inactiva = reanudarSesion(sesion, Date.now());
      expect(inactiva.estado).toBe('inactivo');
    });
  });

  describe('reiniciarSesion', () => {
    it('debe reiniciar la sesión al estado inicial de la fase', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(60_000);
      const pausada = pausarSesion(iniciada, Date.now());

      const reiniciada = reiniciarSesion(pausada, 'trabajo', config, null, Date.now());

      expect(reiniciada.estado).toBe('inactivo');
      expect(reiniciada.duracionRealSegundos).toBe(0);
      expect(reiniciada.tiempoInicio).toBeNull();
      expect(reiniciada.completada).toBe(false);
    });
  });

  describe('completarSesion', () => {
    it('debe marcar la sesión como completada', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const completada = completarSesion(iniciada);

      expect(completada.estado).toBe('completado');
      expect(completada.completada).toBe(true);
    });

    it('no debe completar dos veces la misma sesión', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const completada = completarSesion(iniciada);
      const duplicada = completarSesion(completada);

      expect(duplicada.completada).toBe(true);
      expect(duplicada.estado).toBe('completado');
    });
  });

  describe('cancelarSesion', () => {
    it('debe marcar la sesión como cancelada con motivo', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const cancelada = cancelarSesion(iniciada, 'usuario canceló');

      expect(cancelada.estado).toBe('cancelado');
      expect(cancelada.motivoInterrupcion).toBe('usuario canceló');
    });

    it('no debe cancelar dos veces', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      const cancelada = cancelarSesion(iniciada, 'motivo');
      const duplicada = cancelarSesion(cancelada, 'otro');

      expect(duplicada.motivoInterrupcion).toBe('motivo');
    });
  });

  describe('avanzarFase', () => {
    it('debe avanzar de trabajo a descanso corto', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const { sesion: siguiente, siguienteCiclo } = avanzarFase(
        sesion,
        0,
        config
      );

      expect(siguiente.fase).toBe('descansoCorto');
      expect(siguienteCiclo).toBe(0);
    });

    it('debe avanzar de descanso corto a trabajo e incrementar ciclo', () => {
      const sesion = crearSesionInicial('descansoCorto', config);
      const { sesion: siguiente, siguienteCiclo } = avanzarFase(
        sesion,
        0,
        config
      );

      expect(siguiente.fase).toBe('trabajo');
      expect(siguienteCiclo).toBe(1);
    });

    it('debe avanzar a descanso largo después de N ciclos de trabajo', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const { siguienteCiclo } = avanzarFase(sesion, 3, config);
      const siguienteSesion = crearSesionInicial('trabajo', config);
      const { sesion: faseLargo } = avanzarFase(
        siguienteSesion,
        siguienteCiclo,
        config
      );

      expect(faseLargo.fase).toBe('descansoLargo');
    });
  });

  describe('recuperarSesionTrasRecarga', () => {
    it('debe recuperar una sesión activa recalculando el tiempo restante', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(30_000);

      const recuperada = recuperarSesionTrasRecarga(iniciada, Date.now());

      expect(recuperada.estado).toBe('activo');
      expect(recuperada.duracionRealSegundos).toBeGreaterThan(0);
      expect(recuperada.tiempoFinObjetivo).toBeGreaterThan(Date.now());
    });

    it('debe marcar como completada si el tiempo objetivo ya pasó al recuperar', () => {
      const sesion = crearSesionInicial('trabajo', {
        ...config,
        trabajoMinutos: 0.01,
      });
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(2_000);

      const recuperada = recuperarSesionTrasRecarga(iniciada, Date.now());

      expect(recuperada.estado).toBe('completado');
      expect(recuperada.completada).toBe(true);
    });

    it('no debe modificar una sesión inactiva', () => {
      const sesion = crearSesionInicial('trabajo', config);
      const recuperada = recuperarSesionTrasRecarga(sesion, Date.now());

      expect(recuperada.estado).toBe('inactivo');
    });
  });

  describe('yaPasoElTiempoObjetivo', () => {
    it('debe retornar true si el tiempo objetivo ya pasó', () => {
      const sesion = crearSesionInicial('trabajo', {
        ...config,
        trabajoMinutos: 0.01,
      });
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(2_000);

      expect(yaPasoElTiempoObjetivo(iniciada, Date.now())).toBe(true);
    });

    it('debe retornar false si la sesión no está activa', () => {
      const sesion = crearSesionInicial('trabajo', config);
      expect(yaPasoElTiempoObjetivo(sesion, Date.now())).toBe(false);
    });
  });

  describe('calcularTiempoRestanteSegundos', () => {
    it('debe retornar la duración prevista si la sesión está inactiva', () => {
      const sesion = crearSesionInicial('trabajo', config);
      expect(calcularTiempoRestanteSegundos(sesion)).toBe(25 * 60);
    });

    it('debe retornar 0 si el tiempo ya pasó', () => {
      const sesion = crearSesionInicial('trabajo', {
        ...config,
        trabajoMinutos: 0.01,
      });
      const iniciada = iniciarSesion(sesion);
      vi.advanceTimersByTime(2_000);
      expect(calcularTiempoRestanteSegundos(iniciada, Date.now())).toBe(0);
    });
  });

  describe('determinarSiguienteFase', () => {
    it('debe ir de trabajo a descanso corto', () => {
      expect(determinarSiguienteFase('trabajo', 0, 4)).toBe('descansoCorto');
    });

    it('debe ir de descanso corto a trabajo', () => {
      expect(determinarSiguienteFase('descansoCorto', 0, 4)).toBe('trabajo');
    });

    it('debe ir de descanso largo a trabajo', () => {
      expect(determinarSiguienteFase('descansoLargo', 3, 4)).toBe('trabajo');
    });
  });

  describe('duracionParaFase', () => {
    it('debe retornar segundos para cada fase', () => {
      expect(duracionParaFase('trabajo', config)).toBe(25 * 60);
      expect(duracionParaFase('descansoCorto', config)).toBe(5 * 60);
      expect(duracionParaFase('descansoLargo', config)).toBe(15 * 60);
    });
  });

  describe('formatearTiempo', () => {
    it('debe formatear minutos y segundos con dos dígitos', () => {
      expect(formatearTiempo(150)).toBe('02:30');
      expect(formatearTiempo(5)).toBe('00:05');
      expect(formatearTiempo(0)).toBe('00:00');
    });
  });
});
