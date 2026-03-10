// TODO: buscarUsuarioPorEmail(email)
//   SELECT * FROM usuarios WHERE email = ? AND activo = 1
//   Devuelve el usuario completo o null si no exist

import pool from '../db.js';

export async function buscarUsuarioPorEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ? AND activo = 1',
    [email]
  );
  return rows[0] || null;
}