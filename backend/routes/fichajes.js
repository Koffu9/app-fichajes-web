// TODO: POST /api/fichajes/fichar
//   El trabajador ficha entrada, salida, pausa_inicio o pausa_fin
//   lama a fichajesService para determinar el tipo y registrar
//   Devuelve { ok, tipo 

// TODO: GET /api/fichajes/estado
//   Devuelve el próximo tipo de fichaje del trabajador
//   El frontend lo usa para saber qué botón mostrar
//   Devuelve { ok, proximoTipo, ultimoFichaje }

// TODO: GET /api/fichajes/misfichajes
//   El trabajador consulta sus propios fichajes por fechas
//   Devuelve { ok, fichajes[] }

// TODO: GET /api/fichajes/todos
//   Solo admin: ver fichajes de todos los trabajadores
//   Devuelve { ok, fichajes[] }

// TODO: POST /api/fichajes/alta
//   Solo admin: dar de alta un fichaje manualmente
//   Devuelve { ok }

// TODO: PUT /api/fichajes/modificar/:id
//   Solo admin: modificar un fichaje existente
//   Devuelve { ok }

import express from 'express';
import { authMiddleware, soloAdmin } from '../middleware/auth.js';
import { obtenerEstado, registrarFichaje, registrarPausa, obtenerFichajesUsuario, obtenerTodosFichajes, altaFichajeAdmin, editarFichaje, obtenerMotivosPausaService } from '../services/fichajesService.js';
import { logError } from '../logger.js';

const router = express.Router();

// POST /api/fichajes/fichar
router.post('/fichar', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.usuario.id;
        const resultado = await registrarFichaje(userId);
        return res.status(200).json({ ok: true, ...resultado });
    } catch (error) {
        logError('Error en POST /fichajes/fichar:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// POST /api/fichajes/descanso
router.post('/descanso', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.usuario.id;
        const motivoId = req.body?.motivoId || null;
        const resultado = await registrarPausa(userId, motivoId);
        return res.status(200).json({ ok: true, ...resultado });
    } catch (error) {
        logError('Error en POST /fichajes/descanso:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// GET /api/fichajes/misFichajes
router.get('/misFichajes', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.usuario.id;
        const { fechaInicio, fechaFin } = req.query;
        const fichajes = await obtenerFichajesUsuario(userId, fechaInicio, fechaFin);
        return res.status(200).json({ ok: true, fichajes });
    } catch (error) {
        logError('Error en GET /fichajes/misFichajes:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// GET /api/fichajes/estado
router.get('/estado', authMiddleware, async (req, res) => {
    try {
        const userId = req.session.usuario.id;
        const estado = await obtenerEstado(userId);
        return res.status(200).json({ ok: true, ...estado });
    } catch (error) {
        logError('Error en GET /fichajes/estado:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// GET /api/fichajes/todos (admin)
router.get('/todos', soloAdmin, async (req, res) => {
    try {
        const { fechaInicio, fechaFin, userId } = req.query;
        const fichajes = await obtenerTodosFichajes(fechaInicio, fechaFin, userId);
        return res.status(200).json({ ok: true, fichajes });
    } catch (error) {
        logError('Error en GET /fichajes/todos:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// POST /api/fichajes/alta (admin)
router.post('/alta', soloAdmin, async (req, res) => {
    try {
        const { usuarioId, tipo, fechaHora, motivoId, observaciones } = req.body;
        const modificadoPor = req.session.usuario.id;
        const idFichaje = await altaFichajeAdmin(usuarioId, tipo, fechaHora, motivoId, observaciones, modificadoPor);
        return res.status(201).json({ ok: true, idFichaje });
    } catch (error) {
        logError('Error en POST /fichajes/alta:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// PUT /api/fichajes/modificar/:id (admin)
router.put('/modificar/:id', soloAdmin, async (req, res) => {
    try {
        const { tipo, fechaHora, motivoId, observaciones } = req.body;
        const modificadoPor = req.session.usuario.id;
        const resultado = await editarFichaje(req.params.id, tipo, fechaHora, motivoId, observaciones, modificadoPor);
        return res.status(200).json(resultado);
    } catch (error) {
        logError('Error en PUT /fichajes/modificar:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

// GET /api/fichajes/motivos-pausa
router.get('/motivos-pausa', authMiddleware, async (req, res) => {
    try {
        const motivos = await obtenerMotivosPausaService();
        return res.status(200).json({ ok: true, motivos });
    } catch (error) {
        logError('Error en GET /fichajes/motivos-pausa:', error);
        return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
});

export default router;