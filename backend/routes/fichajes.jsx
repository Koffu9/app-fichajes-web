// TODO: POST /api/fichajes/fichar
//   El trabajador ficha entrada, salida, pausa_inicio o pausa_fin
//   lama a fichajesService para determinar el tipo y registrar
//   Devuelve { ok, tipo 

// TODO: GET /api/fichajes/estado
//   Devuelve el próximo tipo de fichaje del trabajador
//   El frontend lo usa para saber qué botón mostrar
//   Devuelve { ok, proximoTipo, ultimoFichaje }

// TODO: GET /api/fichajes/misfichajes
//   El trabajador consulta sus propios fichajes por fechas
//   Devuelve { ok, fichajes[] }

// TODO: GET /api/fichajes/todos
//   Solo admin: ver fichajes de todos los trabajadores
//   Devuelve { ok, fichajes[] }

// TODO: POST /api/fichajes/alta
//   Solo admin: dar de alta un fichaje manualmente
//   Devuelve { ok }

// TODO: PUT /api/fichajes/modificar/:id
//   Solo admin: modificar un fichaje existente
//   Devuelve { ok }