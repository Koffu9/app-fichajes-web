// TODO: Endpoints de ausencias
// - GET    /api/ausencias                             → buscar ausencias
// - POST   /api/ausencias/alta                        → añadir ausencia
// - PUT    /api/ausencias/modificar/:id               → modificar ausencia
// - GET    /api/ausencias/motivos                     → listar motivos
// - POST   /api/ausencias/motivos/alta                → añadir motivo

import express from 'express';
import { getAusencias, crearAusencia, editarAusencia, getMotivosAusencia } from '../services/ausenciasService.js';
import { soloAdmin } from '../middleware/auth.js';
import { logError } from '../logger.js';

const router = express.Router();

// GET /api/ausencias?anio=2026&usuarioId=2&motivoId=1
router.get('/', soloAdmin, async (req, res) => {
    const { anio, usuarioId, motivoId } = req.query;
    try {
        const ausencias = await getAusencias(anio, usuarioId, motivoId);
        res.json({ ok: true, ausencias });
    } catch (error) {
        logError('GET /ausencias', error);
        res.status(500).json({ ok: false, message: 'Error al obtener las ausencias' });
    }
});

// POST /api/ausencias
router.post('/', soloAdmin, async (req, res) => {
    const { usuarioId, motivoId, fechaInicio, fechaFin, observaciones } = req.body;
    const creadoPor = req.session.usuario.id;
    try {
        const resultado = await crearAusencia(usuarioId, motivoId, fechaInicio, fechaFin, observaciones, creadoPor);
        if (!resultado.ok) return res.status(400).json(resultado);
        res.status(201).json(resultado);
    } catch (error) {
        logError('POST /ausencias', error);
        res.status(500).json({ ok: false, message: 'Error al crear la ausencia' });
    }
});

// PUT /api/ausencias/:id
router.put('/:id', soloAdmin, async (req, res) => {
    const { id } = req.params;
    const { motivoId, fechaInicio, fechaFin, observaciones } = req.body;
    try {
        const resultado = await editarAusencia(id, motivoId, fechaInicio, fechaFin, observaciones);
        if (!resultado.ok) return res.status(404).json(resultado);
        res.json(resultado);
    } catch (error) {
        logError('PUT /ausencias/:id', error);
        res.status(500).json({ ok: false, message: 'Error al modificar la ausencia' });
    }
});

// GET /api/ausencias/motivos
router.get('/motivos', soloAdmin, async (req, res) => {
    try {
        const motivos = await getMotivosAusencia();
        res.json({ ok: true, motivos });
    } catch (error) {
        logError('GET /ausencias/motivos', error);
        res.status(500).json({ ok: false, message: 'Error al obtener los motivos' });
    }
});

export default router;