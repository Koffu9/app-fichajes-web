import {
    obtenerInformeMensual,
    obtenerInformePorTrabajador
} from '../storage/informesStorage.js';

// Informe mensual: resumen de todos los trabajadores en un mes
export async function getInformeMensual(anio, mes) {
    try {
        return await obtenerInformeMensual(anio, mes);
    } catch (error) {
        logError('getInformeMensual', error);
        throw error;
    }
}

// Informe por trabajador: detalle día a día en un rango de fechas
export async function getInformePorTrabajador(usuarioId, desde, hasta) {
    try {
        return await obtenerInformePorTrabajador(usuarioId, desde, hasta);
    } catch (error) {
        logError('obtenerInformePorTrabajador', error);
        throw error;
    }
}