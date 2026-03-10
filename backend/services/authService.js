// TODO: loginService(email, password)
//   Busca el usuario en la BD por email
//   Si no existe devuelve { ok: false, error: 'Credenciales incorrectas' }
//   Compara la contraseña con bcrypt
//   Si no coincide devuelve { ok: false, error: 'Credenciales incorrectas' }
//   Si todo ok devuelve { ok: true, usuario: { id, nombre, apellidos, email, rol } }

import bcrypt from 'bcrypt';
import { buscarUsuarioPorEmail } from '../storage/authStorage.js';

export async function loginService(email, password) {
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario) {
    return { ok: false, message: 'Email o contraseña incorrectos' };
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.password);

  if (!passwordCorrecta) {
    return { ok: false, message: 'Email o contraseña incorrectos' };
  }

  return {
    ok: true,
    user: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol
    }
  };
}