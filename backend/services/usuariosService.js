import { obtenerTrabajadores, obtenerResumenDashboard } from '../storage/usuariosStorage.js';

export async function getTrabajadores() {
    return await obtenerTrabajadores();
}

//Para el dashboard

export async function getResumenDashboard() {
    try {
        return await obtenerResumenDashboard();
    } catch (error) {
        logError('getResumenDashboard', error);
        throw error;
    }
}