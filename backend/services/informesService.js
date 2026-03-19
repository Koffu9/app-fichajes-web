import {
    obtenerInformeMensual,
    obtenerInformePorTrabajador
} from '../storage/informesStorage.js';

// Informe mensual: resumen de todos los trabajadores en un mes
export async function getInformeMensual(anio, mes) {
    return await obtenerInformeMensual(anio, mes);
}

// Informe por trabajador: detalle día a día en un rango de fechas
export async function getInformePorTrabajador(usuarioId, desde, hasta) {
    return await obtenerInformePorTrabajador(usuarioId, desde, hasta);
}