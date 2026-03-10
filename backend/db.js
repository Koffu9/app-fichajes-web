// TODO: Crear pool de conexiones con mysql2/promise
//   host:     localhost
//   user:     root
//   password: ''
//   database: fichajes
//   waitForConnections: true
//
// TODO: Exportar el pool para usarlo en los service


import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fichajes',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;