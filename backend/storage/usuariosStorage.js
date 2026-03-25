import pool from '../db.js';

export async function obtenerTrabajadores() {
    const [rows] = await pool.query(
        `SELECT id, nombre, apellidos 
         FROM usuarios 
         WHERE rol = 'trabajador' AND activo = 1
         ORDER BY apellidos ASC`
    );
    return rows;
}

//Para el dashboard

// Obtiene el número de trabajadores activos y alertas pendientes para el dashboard
export async function obtenerResumenDashboard() {
    const [[{ activos }]] = await pool.query(
        `SELECT COUNT(*) AS activos FROM usuarios 
         WHERE rol = 'trabajador' AND activo = 1`
    );
    const [[{ alertas }]] = await pool.query(
        `SELECT COUNT(*) AS alertas FROM alertas_jornada 
         WHERE resuelta = 0`
    );
    return { activos, alertas };
}