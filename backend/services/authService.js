// TODO: loginService(email, password)
//   Busca el usuario en la BD por email
//   Si no existe devuelve { ok: false, error: 'Credenciales incorrectas' }
//   Compara la contraseña con bcrypt
//   Si no coincide devuelve { ok: false, error: 'Credenciales incorrectas' }
//   Si todo ok devuelve { ok: true, usuario: { id, nombre, apellidos, email, rol } }