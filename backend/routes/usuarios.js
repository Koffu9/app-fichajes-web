import express from 'express';
import { getTrabajadores } from '../services/usuariosService.js';
import { soloAdmin } from '../middleware/auth.js';
import { logError } from '../logger.js';

const router = express.Router();

// GET /api/usuarios/trabajadores
router.get('/trabajadores', soloAdmin, async (req, res) => {
    try {
        const trabajadores = await getTrabajadores();
        res.json({ ok: true, trabajadores });
    } catch (error) {
        logError('Error en GET /usuarios/trabajadores:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener los trabajadores' });
    }
});


//Para dashboard

// GET /api/usuarios/resumen
router.get('/resumen', soloAdmin, async (req, res) => {
    try {
        const resumen = await getResumenDashboard();
        res.json({ ok: true, ...resumen });
    } catch (error) {
        logError('GET /usuarios/resumen', error);
        res.status(500).json({ ok: false, message: 'Error al obtener el resumen' });
    }
});

export default router;