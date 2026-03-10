// TODO: POST /api/auth/login
//   Recibe { email, password }
//   Valida que vienen los dos campos
//   Llama a authService.jsx
//   Si ok guarda el usuario en sesión
//   Devuelve { ok, rol, nombre }

// TODO: POST /api/auth/logout
//   Destruye la sesión del servidor
//   Borra la cookie del navegador
//   Devuelve { ok }

// TODO: GET /api/auth/me
//   Comprueba si hay sesión activa
//   Si hay sesión devuelve { ok, usuario }
//   Si no hay sesión devuelve { ok: false }