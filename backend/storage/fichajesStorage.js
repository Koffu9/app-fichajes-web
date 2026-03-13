// TODO: insertarFichaje(usuarioId, tipo, fechaHora, motivoId, observaciones)
//   INSERT INTO fichajes (usuario_id, tipo, fecha_hora, motivo_id, observaciones)
//   Devuelve el id del fichaje insertado
//
// TODO: obtenerFichajesPorUsuarioYFechas(usuarioId, desde, hasta)
//   SELECT * FROM fichajes WHERE usuario_id = ? 
//     AND fecha_hora BETWEEN ? AND ?
//     ORDER BY fecha_hora ASC
//
// TODO: obtenerTodosFichajesPorFechas(desde, hasta, usuarioId)
//   SELECT * FROM fichajes WHERE fecha_hora BETWEEN ? AND ?
//   Si el admin filtra por trabajador, añadir AND usuario_id = ?
//   ORDER BY fecha_hora ASC
//
// TODO: obtenerFichajePorId(id)
//   SELECT * FROM fichajes WHERE id = ?
//
// TODO: insertarFichajeAdmin(usuarioId, tipo, fechaHora, motivoId, observaciones, modificadoPor)
//   INSERT INTO fichajes (usuario_id, tipo, fecha_hora, motivo_id, observaciones, modificado_por)
//
// TODO: modificarFichaje(id, tipo, fechaHora, motivoId, observaciones, modificadoPor)
//   UPDATE fichajes SET tipo = ?, fecha_hora = ?, motivo_id = ?,
//     observaciones = ?, modificado_por = ? WHERE id = ?
//
// TODO: obtenerFichajesDelDia(usuarioId, fecha)
//   SELECT * FROM fichajes WHERE usuario_id = ?
//     AND DATE(fecha_hora) = ?
//     ORDER BY fecha_hora ASC
//   Lo usa fichajesService para calcular horas del día
//
// TODO: insertarAlerta(usuarioId, fecha, horas)
//   INSERT INTO alertas_jornada (usuario_id, fecha, horas)
//     ON DUPLICATE KEY UPDATE horas = ?, resuelta = 0
//
// TODO: obtenerMotivospausa()
//   SELECT * FROM motivos_pausa WHERE activo = 


import pool from '../db.js';

//Función que devuelve el ultimo fichaje del usuario pasado como parametro.
export async function obtenerUltimoFichaje(usuarioId) {
    const [rows] = await pool.query(
        'SELECT * FROM fichajes WHERE usuario_id = ? ORDER BY fecha_hora DESC LIMIT 1',
        [usuarioId]
    );
    return rows[0] || null;
}

//Función que inserta el fichaje en la tabla fichajes.
export async function insertarFichaje(usuarioId, tipo, fechaHora, motivoId = null, observaciones = null) {
    const [result] = await pool.query(
        'INSERT INTO fichajes (usuario_id, tipo, fecha_hora, motivo_id, observaciones) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, tipo, fechaHora, motivoId, observaciones]
    );
    return result.insertId;
}

//Función que obtiene los fichajes por fecha, además el admin podrá elegir el trabajador por el que filtrar, o ver todos los fichajes de ese día.
export async function obtenerTodosFichajesPorFechas(desde = null, hasta = null, usuarioId = null) {
    let query = 'SELECT * FROM fichajes WHERE fecha_hora BETWEEN ? AND ?';
    const params = [desde, hasta];

    //Si le mandamos el usuarioId (por ejemplo si la llamada es del trabajador) se añade estos parametros a la query
    if (usuarioId) {
        query += ' AND usuario_id = ?';
        params.push(usuarioId);
    }

    //Añadimos al final que queremos que lo ordene desde el último fichaje hasta el primero
    query += ' ORDER BY fecha_hora ASC';
    const [rows] = await pool.query(query, params);
    return rows;
}

//Misma función que obtenerTodosFichajesPorFechas  pero esta para que un trabajador pueda ver un historias de sus fichajes.
export async function obtenerFichajesPorUsuario(usuarioId, desde = null, hasta = null) {
    let query = 'SELECT * FROM fichajes WHERE usuario_id = ?';
    const params = [usuarioId];

    //Si se le pasa una fecha de inicio y una de final, filtrará por fechas.
    if (desde && hasta) {
        query += ' AND fecha_hora BETWEEN ? AND ?';
        params.push(desde, hasta);
    }

    query += ' ORDER BY fecha_hora ASC';
    const [rows] = await pool.query(query, params);
    return rows;
}


//Función que devuelve un fichaje filtrado por su id
export async function obtenerFichajePorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM fichajes WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

//Función para crear un fichaje manualmente (Solo admin)
export async function insertarFichajeAdmin(usuarioId, tipo, fechaHora, motivoId = null, observaciones = null, modificadoPor) {
    const [result] = await pool.query(
        'INSERT INTO fichajes (usuario_id, tipo, fecha_hora, motivo_id, observaciones, modificado_por) VALUES (?, ?, ?, ?, ?, ?)',
        [usuarioId, tipo, fechaHora, motivoId, observaciones, modificadoPor]
    );
    return result.insertId;
}

//Función que se ejecuta cuando un administrador modifica un fichaje y lo actualiza en la bd.
export async function modificarFichaje(id, tipo, fechaHora, motivoId = null, observaciones = null, modificadoPor) {
    await pool.query(
        'UPDATE fichajes SET tipo = ?, fecha_hora = ?, motivo_id = ?, observaciones = ?, modificado_por = ? WHERE id = ?',
        [tipo, fechaHora, motivoId, observaciones, modificadoPor, id]
    );
}

//Función que devuelve los fichajes de un usuario en una fecha concreta.
export async function obtenerFichajesDelDia(usuarioId, fecha) {
    const [rows] = await pool.query(
        'SELECT * FROM fichajes WHERE usuario_id = ? AND DATE(fecha_hora) = ? ORDER BY fecha_hora ASC',
        [usuarioId, fecha]
    );
    return rows;
}

//Función que se utiliza para subir una alerta cuando sea necesario a la tabla alertas
export async function insertarAlerta(usuarioId, fecha, horas) {
    await pool.query(
        'INSERT INTO alertas_jornada (usuario_id, fecha, horas) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE horas = ?, resuelta = 0',
        [usuarioId, fecha, horas, horas]
    );
}

//Función que devuelve los motivos de la pausa de un trabajador.
export async function obtenerMotivosPausa() {
    const [rows] = await pool.query(
        'SELECT * FROM motivos_pausa WHERE activo = 1'
    );
    return rows;
}