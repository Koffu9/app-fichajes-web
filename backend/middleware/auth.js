// TODO: authMiddleware(req, res, next)
//   Comprueba que hay una sesión activa
//   Si no hay sesión devuelve error 401

// TODO: soloAdmin(req, res, next)
//   Comprueba que hay sesión activa Y que el rol es admin
//   Si no hay sesión devuelve error 401
//   Si hay sesión pero no es admin devuelve error 403

export function authMiddleware(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ ok: false, message: 'Debes iniciar sesión para acceder a esta página' });
  }
  next();
}

export function soloAdmin(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ ok: false, message: 'Debes iniciar sesión para acceder a esta página' });
  }
  if (req.session.usuario.rol !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Solo el administrador puede acceder a esta página' });
  }
  next();
}