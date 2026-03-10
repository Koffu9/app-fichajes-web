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