// TODO: obtenerFichajesMensuales(mes, anio, usuarioId)
//  Aqui sería una subconsulta con JOIN
//
// TODO: obtenerFichajesPorTrabajador(usuarioId, desde, hasta)
//   SELECT * FROM fichajes WHERE usuario_id = ?
//     AND fecha_hora BETWEEN ? AND ?
//     ORDER BY fecha_hora ASC
//
// TODO: obtenerTodosUsuariosActivos()
//   SELECT id, nombre, apellidos FROM usuarios
//     WHERE activo = 1 AND rol = 'trabajador'
//     ORDER BY apellidos ASC

import pool from '../db.js';

// Informe mensual: resumen de todos los trabajadores en un mes
export async function obtenerInformeMensual(anio, mes) {
    const [rows] = await pool.query(
        `SELECT 
            u.id                                        AS usuario_id,
            u.nombre,
            u.apellidos,
            COUNT(hj.id)                                AS dias_trabajados,
            COALESCE(SUM(hj.horas_trabajadas), 0)       AS horas_totales,
            COALESCE(SUM(hj.horas_pausa), 0)            AS pausas_totales,
            COALESCE(SUM(hj.jornada_completa), 0)       AS jornadas_completas,
            COUNT(hj.id) - COALESCE(SUM(hj.jornada_completa), 0) AS jornadas_incompletas
         FROM usuarios u
         LEFT JOIN historial_jornadas hj 
            ON hj.usuario_id = u.id
            AND YEAR(hj.fecha) = ?
            AND MONTH(hj.fecha) = ?
         WHERE u.activo = 1 AND u.rol = 'trabajador'
         GROUP BY u.id, u.nombre, u.apellidos
         ORDER BY u.apellidos ASC`,
        [anio, mes]
    );
    return rows;
}

// Informe por trabajador: detalle día a día en un rango de fechas
export async function obtenerInformePorTrabajador(usuarioId, desde, hasta) {
    const [rows] = await pool.query(
        `SELECT
            hj.fecha,
            hj.hora_entrada,
            hj.hora_salida,
            hj.horas_trabajadas,
            hj.horas_pausa,
            hj.jornada_completa
         FROM historial_jornadas hj
         WHERE hj.usuario_id = ?
           AND hj.fecha BETWEEN ? AND ?
         ORDER BY hj.fecha ASC`,
        [usuarioId, desde, hasta]
    );
    return rows;
}