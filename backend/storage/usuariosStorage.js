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