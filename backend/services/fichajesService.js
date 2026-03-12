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
    obtenerMotivosPausa
} from '../storage/fichajesStorage.js';


/* Determina qué tipo de fichaje le toca al usuario 
se obtiene el ultimo fichaje y en base a que es, se prepara el siguiente fichaje*/ 
export async function obtenerEstado(usuarioId) {
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

    return { proximoTipo: 'entrada', ultimoFichaje: ultimo };
}

// Registra un fichaje del trabajador
export async function registrarFichaje(usuarioId) {
  const { proximoTipoFichar } = await obtenerEstado(usuarioId);
  const ahora = new Date();

  await insertarFichaje(usuarioId, proximoTipoFichar, ahora);

  if (proximoTipoFichar === 'salida') {
    await calcularYAlertarJornada(usuarioId, ahora);
  }

  return { tipo: proximoTipoFichar };
}
// Registra una pausa del trabajador
export async function registrarPausa(usuarioId, motivoId = null) {
  const { proximoTipoPausa } = await obtenerEstado(usuarioId);
  const ahora = new Date();

  await insertarFichaje(usuarioId, proximoTipoPausa, ahora, motivoId);

  return { tipo: proximoTipoPausa };
}

// Calcula las horas trabajadas del día y genera alerta si son menos de 8
async function calcularYAlertarJornada(usuarioId, fechaHora) {
    const fecha = fechaHora.toISOString().split('T')[0]; // YYYY-MM-DD
    const fichajes = await obtenerFichajesDelDia(usuarioId, fecha);

    let horasTrabajadas = 0;
    let horaEntrada = null;
    let horaPausaInicio = null;

    for (const fichaje of fichajes) {
        const hora = new Date(fichaje.fecha_hora);

        if (fichaje.tipo === 'entrada') {
            horaEntrada = hora;
        } else if (fichaje.tipo === 'pausa_inicio' && horaEntrada) {
            horasTrabajadas += (hora - horaEntrada) / (1000 * 60 * 60);
            horaPausaInicio = hora;
            horaEntrada = null;
        } else if (fichaje.tipo === 'pausa_fin') {
            horaEntrada = hora;
            horaPausaInicio = null;
        } else if (fichaje.tipo === 'salida' && horaEntrada) {
            horasTrabajadas += (hora - horaEntrada) / (1000 * 60 * 60);
        }
    }

    if (horasTrabajadas < 8) {
        await insertarAlerta(usuarioId, fecha, parseFloat(horasTrabajadas.toFixed(2)));
    }
}

// Obtiene los fichajes de un usuario por fechas
export async function obtenerFichajesUsuario(usuarioId, desde, hasta) {
    return await obtenerTodosFichajesPorFechas(desde, hasta, usuarioId);
}

// Obtiene todos los fichajes (solo admin), con filtro opcional por usuario
export async function obtenerTodosFichajes(desde, hasta, usuarioId = null) {
    return await obtenerTodosFichajesPorFechas(desde, hasta, usuarioId);
}

// Da de alta un fichaje manualmente (solo admin)
export async function altaFichajeAdmin(usuarioId, tipo, fechaHora, motivoId = null, observaciones = null, adminId) {
    return await insertarFichajeAdmin(usuarioId, tipo, fechaHora, motivoId, observaciones, adminId);
}

// Modifica un fichaje existente (solo admin)
export async function editarFichaje(id, tipo, fechaHora, motivoId = null, observaciones = null, adminId) {
    const fichaje = await obtenerFichajePorId(id);
    if (!fichaje) return { ok: false, message: 'Fichaje no encontrado' };

    await modificarFichaje(id, tipo, fechaHora, motivoId, observaciones, adminId);
    return { ok: true };
}

// Obtiene los motivos de pausa disponibles
export async function obtenerMotivosPausaService() {
    return await obtenerMotivosPausa();
}