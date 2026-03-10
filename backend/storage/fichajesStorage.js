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