// TODO: Al cargar la pantalla llamar a GET /api/fichajes/estado
//   Devuelve { proximoTipo, ultimoFichaje }
//   Usar el proximoTipo para saber qué botón mostrar
//
// TODO: Mostrar botón según proximoTipo
//   'entrada'       → botón FICHAR ENTRADA
//   'salida'        → botón FICHAR SALIDA
//   'pausa_inicio'  → botón INICIAR PAUSA (mostrar selector de motivo)
//   'pausa_fin'     → botón VOLVER DE PAUSA
//
// TODO: Al pulsar el botón llamar a POST /api/fichajes/fichar
//   Si es pausa_inicio mandar también el motivoId seleccionado
//   Actualizar el botón con el nuevo proximoTipo devuelto
//
// TODO: Mostrar el último fichaje registrado debajo del botón
//
// TODO: Sección de búsqueda de fichajes propios por fechas
//   Llamar a GET /api/fichajes/misfichajes
//   Mostrar los resultados en una list