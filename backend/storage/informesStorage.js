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