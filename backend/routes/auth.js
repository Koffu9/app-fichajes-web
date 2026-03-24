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

// routes/auth.js
import express from 'express';
import { loginService } from '../services/authService.js';
import { authMiddleware } from '../middleware/auth.js';
import { logError } from '../logger.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'Email y contraseña son obligatorios' });
  }

  try {
        const resultado = await loginService(email, password);

        if (!resultado.ok) {
            return res.status(401).json(resultado);
        }

        req.session.usuario = resultado.user;
        return res.status(200).json(resultado);
    } catch (error) {
        logError('POST /auth/login', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
        req.session.destroy();
        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error en POST /auth/logout:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  try {
    return res.status(200).json({ ok: true, user: req.session.usuario });
  } catch (error) {
    console.error('Error en GET /auth/me:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

export default router;