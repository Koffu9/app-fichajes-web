import {
    obtenerAusencias,
    insertarAusencia,
    obtenerAusenciaPorId,
    modificarAusencia,
    obtenerMotivosAusencia
} from '../storage/ausenciasStorage.js';
import { logError } from '../logger.js';

// Obtiene ausencias con filtros opcionales
export async function getAusencias(anio, usuarioId, motivoId) {
    try {
        return await obtenerAusencias(anio, usuarioId, motivoId);
    } catch (error) {
        logError('getAusencias', error);
        throw error;
    }
}

// Crea una nueva ausencia
export async function crearAusencia(usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor) {
    try {
        if (!usuarioId || !motivoId || !fechaInicio || !fechaFin) {
            return { ok: false, message: 'Faltan campos obligatorios' };
        }
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            return { ok: false, message: 'La fecha de inicio no puede ser posterior a la fecha de fin' };
        }
        const id = await insertarAusencia(usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor);
        return { ok: true, id };
    } catch (error) {
        logError('crearAusencia', error);
        throw error;
    }
}

// Modifica una ausencia existente
export async function editarAusencia(id, motivoId, fechaInicio, fechaFin, observaciones) {
    try {
        const ausencia = await obtenerAusenciaPorId(id);
        if (!ausencia) return { ok: false, message: 'Ausencia no encontrada' };

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            return { ok: false, message: 'La fecha de inicio no puede ser posterior a la fecha de fin' };
        }

        await modificarAusencia(id, motivoId, fechaInicio, fechaFin, observaciones);
        return { ok: true };
    } catch (error) {
        logError('editarAusencia', error);
        throw error;
    }
}

// Obtiene los motivos de ausencia disponibles
export async function getMotivosAusencia() {
    try {
        return await obtenerMotivosAusencia();
    } catch (error) {
        logError('getMotivosAusencia', error);
        throw error;
    }
}