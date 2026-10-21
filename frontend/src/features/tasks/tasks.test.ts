import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  filtrarTareas,
  ordenarTareas,
  actualizarTarea,
  cambiarEstadoTarea,
  incrementarPomodorosCompletados,
  sumarTiempoSesion,
  validarTareaInput,
} from './taskUtils';
import { crearTarea } from './types';
import type { Tarea } from './types';

describe('tareas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z').getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('crearTarea', () => {
    it('debe crear una tarea pendiente con valores por defecto', () => {
      const tarea = crearTarea({ titulo: 'Estudiar TypeScript' });

      expect(tarea.titulo).toBe('Estudiar TypeScript');
      expect(tarea.estado).toBe('pendiente');
      expect(tarea.prioridad).toBe('media');
      expect(tarea.objetivoPomodoros).toBe(1);
      expect(tarea.pomodorosCompletados).toBe(0);
      expect(tarea.tiempoAcumuladoSegundos).toBe(0);
      expect(tarea.archivada).toBe(false);
      expect(tarea.id).toBeDefined();
    });

    it('debe recortar espacios del título', () => {
      const tarea = crearTarea({ titulo: '  Leer libro  ' });
      expect(tarea.titulo).toBe('Leer libro');
    });

    it('debe aceptar descripción opcional', () => {
      const tarea = crearTarea({
        titulo: 'Tarea',
        descripcion: 'Detalles de la tarea',
      });
      expect(tarea.descripcion).toBe('Detalles de la tarea');
    });

    it('debe aceptar prioridad y objetivo personalizados', () => {
      const tarea = crearTarea({
        titulo: 'Tarea',
        prioridad: 'alta',
        objetivoPomodoros: 5,
      });
      expect(tarea.prioridad).toBe('alta');
      expect(tarea.objetivoPomodoros).toBe(5);
    });
  });

  const crearTareaConEstado = (
    input: Parameters<typeof crearTarea>[0],
    estado?: Tarea['estado']
  ): Tarea => {
    const tarea = crearTarea(input);
    if (estado) {
      return cambiarEstadoTarea(tarea, estado);
    }
    return tarea;
  };

  describe('filtrarTareas', () => {
    const tareas = [
      crearTareaConEstado({ titulo: 'Tarea A', prioridad: 'alta' }, 'pendiente'),
      crearTareaConEstado({ titulo: 'Tarea B', prioridad: 'media' }, 'enProgreso'),
      crearTareaConEstado({ titulo: 'Tarea C', prioridad: 'baja' }, 'completada'),
    ];

    it('debe filtrar por estado', () => {
      const resultado = filtrarTareas(tareas, { estado: 'pendiente' });
      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe('Tarea A');
    });

    it('debe filtrar por prioridad', () => {
      const resultado = filtrarTareas(tareas, { prioridad: 'alta' });
      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe('Tarea A');
    });

    it('debe filtrar por búsqueda de texto', () => {
      const resultado = filtrarTareas(tareas, { busqueda: 'tarea b' });
      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe('Tarea B');
    });

    it('debe excluir tareas archivadas', () => {
      const archivada = cambiarEstadoTarea(tareas[0], 'archivada');
      const resultado = filtrarTareas([archivada, tareas[1], tareas[2]], {});
      expect(resultado).toHaveLength(2);
    });
  });

  describe('ordenarTareas', () => {
    it('debe ordenar por estado y fecha de actualización', () => {
      const t1 = crearTareaConEstado({ titulo: 'Completada' }, 'completada');
      const t2 = crearTareaConEstado({ titulo: 'Pendiente' }, 'pendiente');
      const t3 = crearTareaConEstado({ titulo: 'En progreso' }, 'enProgreso');

      const ordenadas = ordenarTareas([t1, t2, t3]);
      expect(ordenadas[0].estado).toBe('pendiente');
      expect(ordenadas[1].estado).toBe('enProgreso');
      expect(ordenadas[2].estado).toBe('completada');
    });
  });

  describe('actualizarTarea', () => {
    it('debe actualizar los campos proporcionados', () => {
      const tarea = crearTarea({ titulo: 'Original' });
      const actualizada = actualizarTarea(tarea, { titulo: 'Modificada' });

      expect(actualizada.titulo).toBe('Modificada');
      expect(actualizada.id).toBe(tarea.id);
      expect(typeof actualizada.fechaActualizacion).toBe('number');
    });
  });

  describe('cambiarEstadoTarea', () => {
    it('debe cambiar el estado y marcar como archivada si corresponde', () => {
      const tarea = crearTarea({ titulo: 'Tarea' });
      const archivada = cambiarEstadoTarea(tarea, 'archivada');

      expect(archivada.estado).toBe('archivada');
      expect(archivada.archivada).toBe(true);
    });

    it('no debe archivar si el estado es completada', () => {
      const tarea = crearTarea({ titulo: 'Tarea' });
      const completada = cambiarEstadoTarea(tarea, 'completada');

      expect(completada.estado).toBe('completada');
      expect(completada.archivada).toBe(false);
    });
  });

  describe('incrementarPomodorosCompletados', () => {
    it('debe incrementar el contador y sumar 25 min de tiempo acumulado', () => {
      const tarea = crearTarea({ titulo: 'Tarea' });
      const actualizada = incrementarPomodorosCompletados(tarea);

      expect(actualizada.pomodorosCompletados).toBe(1);
      expect(actualizada.tiempoAcumuladoSegundos).toBe(25 * 60);
    });
  });

  describe('sumarTiempoSesion', () => {
    it('debe sumar segundos al tiempo acumulado', () => {
      const tarea = crearTarea({ titulo: 'Tarea' });
      const actualizada = sumarTiempoSesion(tarea, 900);

      expect(actualizada.tiempoAcumuladoSegundos).toBe(900);
    });
  });

  describe('validarTareaInput', () => {
    it('debe rechazar título vacío', () => {
      const errores = validarTareaInput({ titulo: '' });
      expect(errores).toContain('El título es obligatorio');
    });

    it('debe rechazar título muy largo', () => {
      const errores = validarTareaInput({ titulo: 'a'.repeat(201) });
      expect(errores).toContain('El título no puede exceder los 200 caracteres');
    });

    it('debe rechazar objetivo fuera de rango', () => {
      const errores = validarTareaInput({ titulo: 'Tarea', objetivoPomodoros: 0 });
      expect(errores).toContain('El objetivo de Pomodoros debe estar entre 1 y 50');
    });

    it('no debe tener errores con datos válidos', () => {
      const errores = validarTareaInput({
        titulo: 'Tarea válida',
        descripcion: 'Descripción',
        prioridad: 'media',
        objetivoPomodoros: 3,
      });
      expect(errores).toHaveLength(0);
    });
  });
});
