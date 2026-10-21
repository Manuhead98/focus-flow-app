import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { crearNota, validarNotaInput } from './types';
import { filtrarNotasPorTarea, actualizarNota } from './noteUtils';

describe('notas', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T10:00:00Z').getTime());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('crearNota', () => {
    it('debe crear una nota con contenido y fechas', () => {
      const nota = crearNota({ contenido: 'Nota de prueba' });

      expect(nota.contenido).toBe('Nota de prueba');
      expect(nota.tareaId).toBeNull();
      expect(nota.id).toBeDefined();
      expect(typeof nota.fechaCreacion).toBe('number');
      expect(typeof nota.fechaActualizacion).toBe('number');
    });

    it('debe recortar espacios del contenido', () => {
      const nota = crearNota({ contenido: '  Contenido  ' });
      expect(nota.contenido).toBe('Contenido');
    });

    it('debe aceptar tareaId opcional', () => {
      const nota = crearNota({ contenido: 'Nota', tareaId: 'tarea-1' });
      expect(nota.tareaId).toBe('tarea-1');
    });
  });

  describe('validarNotaInput', () => {
    it('debe rechazar contenido vacío', () => {
      const errores = validarNotaInput('');
      expect(errores).toContain('El contenido no puede estar vacío');
    });

    it('debe rechazar contenido muy largo', () => {
      const errores = validarNotaInput('a'.repeat(5001));
      expect(errores).toContain('El contenido no puede exceder los 5000 caracteres');
    });

    it('no debe tener errores con contenido válido', () => {
      const errores = validarNotaInput('Nota válida');
      expect(errores).toHaveLength(0);
    });
  });

  describe('filtrarNotasPorTarea', () => {
    const notas = [
      crearNota({ contenido: 'Nota 1', tareaId: 'tarea-1' }),
      crearNota({ contenido: 'Nota 2', tareaId: 'tarea-2' }),
      crearNota({ contenido: 'Nota 3', tareaId: null }),
    ];

    it('debe filtrar por tareaId', () => {
      const resultado = filtrarNotasPorTarea(notas, 'tarea-1');
      expect(resultado).toHaveLength(1);
      expect(resultado[0].contenido).toBe('Nota 1');
    });

    it('debe devolver todas si tareaId es null', () => {
      const resultado = filtrarNotasPorTarea(notas, null);
      expect(resultado).toHaveLength(3);
    });
  });

  describe('actualizarNota', () => {
    it('debe actualizar el contenido y la fecha', () => {
      const nota = crearNota({ contenido: 'Original' });
      const actualizada = actualizarNota(nota, { contenido: 'Modificada' });

      expect(actualizada.contenido).toBe('Modificada');
      expect(actualizada.id).toBe(nota.id);
    });
  });
});
