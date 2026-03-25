// TODO: obtenerAusencias(anio, usuarioId, motivoId)
//   Seria una subconsulta con un join donde se filtra ausencias y usuarios a la vez
//   Si usuarioId viene informado añadir AND a.usuario_id = ?
//   Si motivoId viene informado añadir AND a.motivo_id = ?
//   ORDER BY a.fecha_inicio ASC
//
// TODO: insertarAusencia(usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor)
//   INSERT INTO ausencias
//     (usuario_id, motivo_id, fecha_inicio, fecha_fin, observaciones, creado_por)
//
// TODO: modificarAusencia(id, motivoId, fechaInicio, fechaFin, observaciones)
//   UPDATE ausencias SET motivo_id = ?, fecha_inicio = ?,
//     fecha_fin = ?, observaciones = ? WHERE id = ?
//
// TODO: obtenerMotivosAusencia()
//   SELECT * FROM motivos_ausencia WHERE activo = 1
//
// TODO: insertarMotivoAusencia(nombre, descripcion)
//   INSERT INTO motivos_ausencia (nombre, descripcion

import pool from '../db.js';

// Obtiene todas las ausencias con filtros opcionales por año, trabajador y motivo
export async function obtenerAusencias(anio = null, usuarioId = null, motivoId = null) {
    let query = `
        SELECT 
            a.id,
            u.nombre,
            u.apellidos,
            m.nombre AS motivo,
            a.fecha_inicio,
            a.fecha_fin,
            a.observaciones,
            a.created_at
        FROM ausencias a
        JOIN usuarios u ON u.id = a.usuario_id
        JOIN motivos_ausencia m ON m.id = a.motivo_id
        WHERE 1=1
    `;
    const params = [];

    if (anio) {
        query += ' AND YEAR(a.fecha_inicio) = ?';
        params.push(anio);
    }
    if (usuarioId) {
        query += ' AND a.usuario_id = ?';
        params.push(usuarioId);
    }
    if (motivoId) {
        query += ' AND a.motivo_id = ?';
        params.push(motivoId);
    }

    query += ' ORDER BY a.fecha_inicio DESC';

    const [rows] = await pool.query(query, params);
    return rows;
}

// Inserta una nueva ausencia
export async function insertarAusencia(usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor) {
    const [result] = await pool.query(
        `INSERT INTO ausencias (usuario_id, motivo_id, fecha_inicio, fecha_fin, observaciones, creado_por)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor]
    );
    return result.insertId;
}

// Obtiene una ausencia por id
export async function obtenerAusenciaPorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM ausencias WHERE id = ?',
        [id]
    );
    return rows[0] || null;
}

// Modifica una ausencia existente
export async function modificarAusencia(id, motivoId, fechaInicio, fechaFin, observaciones) {
    await pool.query(
        `UPDATE ausencias SET motivo_id = ?, fecha_inicio = ?, fecha_fin = ?, observaciones = ?
         WHERE id = ?`,
        [motivoId, fechaInicio, fechaFin, observaciones, id]
    );
}

// Obtiene todos los motivos de ausencia activos
export async function obtenerMotivosAusencia() {
    const [rows] = await pool.query(
        'SELECT * FROM motivos_ausencia WHERE activo = 1'
    );
    return rows;
}