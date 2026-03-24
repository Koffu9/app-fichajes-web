// TODO: Lógica de los fichajes
// - determinarTipo()     → decide si es entrada, salida, pausa_inicio o pausa_fin
// - calcularHoras()      → calcula horas trabajadas descontando pausas
// - generarAlerta()      → crea alerta si horas < 8

// services/fichajesService.js
import {
    obtenerUltimoFichaje,
    insertarFichaje,
    obtenerTodosFichajesPorFechas,
    obtenerFichajePorId,
    insertarFichajeAdmin,
    modificarFichaje,
    obtenerFichajesDelDia,
    insertarAlerta,
    obtenerMotivosPausa,
    obtenerFichajesPorUsuario,
    insertarHistorialJornada
} from '../storage/fichajesStorage.js';
import { JORNADA_HORAS } from '../config.js';
import { logError } from '../logger.js';

/* Determina qué tipo de fichaje le toca al usuario 
se obtiene el ultimo fichaje y en base a que es, se prepara el siguiente fichaje*/
export async function obtenerEstado(usuarioId) {

    try {
        const ultimo = await obtenerUltimoFichaje(usuarioId);

        if (!ultimo || ultimo.tipo === 'salida') {
            return { proximoTipoFichar: 'entrada', pausaVisible: false };
        }
        if (ultimo.tipo === 'entrada' || ultimo.tipo === 'pausa_fin') {
            return { proximoTipoFichar: 'salida', pausaVisible: true, proximoTipoPausa: 'pausa_inicio' };
        }
        if (ultimo.tipo === 'pausa_inicio') {
            return { proximoTipoFichar: null, pausaVisible: true, proximoTipoPausa: 'pausa_fin' };
        }

        return { proximoTipoFichar: 'entrada', ultimoFichaje: ultimo };
    } catch (error) {
        logError('obtenerEstado', error);
        throw error;
    }
}

// Registra un fichaje del trabajador
export async function registrarFichaje(usuarioId) {

    try {
        const { proximoTipoFichar } = await obtenerEstado(usuarioId);
        const ahora = new Date();

        //No estamos recuperando el user.id deberiamos usar un try and catch
        await insertarFichaje(usuarioId, proximoTipoFichar, ahora);

        if (proximoTipoFichar === 'salida') {
            await calcularYAlertarJornada(usuarioId, ahora);
        }

        return { tipo: proximoTipoFichar };
    } catch (error) {
        logError('registrarFichaje', error);
        throw error;
    }
}
// Registra una pausa del trabajador
export async function registrarPausa(usuarioId, motivoId = null) {
    try {
        const { proximoTipoPausa } = await obtenerEstado(usuarioId);
        const ahora = new Date();

        await insertarFichaje(usuarioId, proximoTipoPausa, ahora, motivoId);

        return { tipo: proximoTipoPausa };
    } catch (error) {
        logError('registrarPausa', error);
        throw error;
    }
}

// Calcula las horas trabajadas del día y genera alerta si son menos de 8 
async function calcularYAlertarJornada(usuarioId, fechaHora) {
    try {
        const fecha = fechaHora.toISOString().split('T')[0]; // YYYY-MM-DD
        const fichajes = await obtenerFichajesDelDia(usuarioId, fecha);

        let horasTrabajadas = 0;
        let horasPausa = 0;
        let horaEntrada = null;
        let horaPausaInicio = null;
        let primeraEntrada = null;

        for (const fichaje of fichajes) {
            const hora = new Date(fichaje.fecha_hora);

            if (fichaje.tipo === 'entrada') {
                horaEntrada = hora;
                if (!primeraEntrada) primeraEntrada = hora;

            } else if (fichaje.tipo === 'pausa_inicio' && horaEntrada) {
                horasTrabajadas += (hora - horaEntrada) / (1000 * 60 * 60);
                horaPausaInicio = hora;
                horaEntrada = null;

            } else if (fichaje.tipo === 'pausa_fin') {
                if (horaPausaInicio) {
                    horasPausa += (hora - horaPausaInicio) / (1000 * 60 * 60); // acumula las horas de pausa.
                }
                horaEntrada = hora;
                horaPausaInicio = null;

            } else if (fichaje.tipo === 'salida' && horaEntrada) {
                horasTrabajadas += (hora - horaEntrada) / (1000 * 60 * 60);
            }
        }

        const horasRedondeadas = parseFloat(horasTrabajadas.toFixed(2));
        const pausasRedondeadas = parseFloat(horasPausa.toFixed(2));

        await insertarHistorialJornada(
            usuarioId,
            fecha,
            primeraEntrada,
            fechaHora,
            horasRedondeadas,
            pausasRedondeadas
        );

        if (horasRedondeadas < JORNADA_HORAS) {
            await insertarAlerta(usuarioId, fecha, horasRedondeadas);
        }
    } catch (error) {
        logError('calcularYAlertarJornada', error);
        throw error;
    }
}

// Obtiene los fichajes de un usuario por fechas
export async function obtenerFichajesUsuario(usuarioId, desde, hasta) {
    try {
        return await obtenerFichajesPorUsuario(usuarioId, desde, hasta);
    } catch (error) {
        logError('obtenerFichajesUsuario', error);
        throw error;
    }
}

// Obtiene todos los fichajes (solo admin), con filtro opcional por usuario
export async function obtenerTodosFichajes(desde, hasta, usuarioId = null) {
    try {
        return await obtenerTodosFichajesPorFechas(desde, hasta, usuarioId);
    } catch (error) {
        logError('obtenerTodosFichajes', error);
        throw error;
    }
}

// Da de alta un fichaje manualmente (solo admin)
export async function altaFichajeAdmin(usuarioId, tipo, fechaHora, motivoId = null, observaciones = null, adminId) {
    try {
        return await insertarFichajeAdmin(usuarioId, tipo, fechaHora, motivoId, observaciones, adminId);
    } catch (error) {
        logError('altaFichajeAdmin', error);
        throw error;
    }
}

// Modifica un fichaje existente (solo admin)
export async function editarFichaje(id, tipo, fechaHora, motivoId = null, observaciones = null, adminId) {
    try {
        const fichaje = await obtenerFichajePorId(id);
        if (!fichaje) return { ok: false, message: 'Fichaje no encontrado' };

        await modificarFichaje(id, tipo, fechaHora, motivoId, observaciones, adminId);
        return { ok: true };
    } catch (error) {
        logError('editarFichaje', error);
        throw error;
    }
}

// Obtiene los motivos de pausa disponibles
export async function obtenerMotivosPausaService() {
    try {
        return await obtenerMotivosPausa();
    } catch (error) {
        logError('obtenerMotivosPausaService', error);
        throw error;
    }
}