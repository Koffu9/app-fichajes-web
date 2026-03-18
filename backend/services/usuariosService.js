import { obtenerTrabajadores } from '../storage/usuariosStorage.js';

export async function getTrabajadores() {
    return await obtenerTrabajadores();
}