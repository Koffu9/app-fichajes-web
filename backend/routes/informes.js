// TODO: GET /api/informes/mensual
//   Informe de horas mensual de todos los trabajadores
//   Solo admin
//
// TODO: GET /api/informes/trabajador
//   Informe de horas de un trabajador en un rango de fechas
//   Solo admin

import express from 'express';
import { getInformeMensual, getInformePorTrabajador } from '../services/informesService.js';
import { authMiddleware, soloAdmin } from '../middleware/auth.js';
import { logError } from '../logger.js';

const router = express.Router();

// GET /api/informes/mensual?anio=2026&mes=3
router.get('/mensual', soloAdmin, async (req, res) => {
    const { anio, mes } = req.query;

    if (!anio || !mes) {
        return res.status(400).json({ ok: false, message: 'Faltan parámetros: anio y mes son obligatorios' });
    }

    try {
        const informe = await getInformeMensual(parseInt(anio), parseInt(mes));
        res.json({ ok: true, informe });
    } catch (error) {
        logError('Error en GET /informes/mensual:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener el informe mensual' });
    }
});

// GET /api/informes/trabajador/:id?desde=2026-03-01&hasta=2026-03-31
router.get('/trabajador/:id', soloAdmin, async (req, res) => {
    const { id } = req.params;
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
        return res.status(400).json({ ok: false, message: 'Faltan parámetros: desde y hasta son obligatorios' });
    }

    try {
        const informe = await getInformePorTrabajador(parseInt(id), desde, hasta);
        res.json({ ok: true, informe });
    } catch (error) {
        logError('Error en GET /informes/trabajador:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener el informe del trabajador' });
    }
});

// GET /api/informes/mio?desde=2026-03-01&hasta=2026-03-31
router.get('/mio', authMiddleware, async (req, res) => {
    const usuarioId = req.session.usuario.id;
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
        return res.status(400).json({ ok: false, message: 'Faltan parámetros: desde y hasta son obligatorios' });
    }

    try {
        const informe = await getInformePorTrabajador(usuarioId, desde, hasta);
        res.json({ ok: true, informe });
    } catch (error) {
        logError('Error en GET /informes/mio:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener tu informe' });
    }
});

export default router;