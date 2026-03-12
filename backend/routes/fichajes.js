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
import { obtenerEstado, registrarFichaje, registrarPausa, obtenerFichajesUsuario, obtenerTodosFichajes, altaFichajeAdmin, editarFichaje } from '../services/fichajesService.js';

const router = express.Router();

// POST /api/auth/fichar
router.post('/fichar', authMiddleware, async (req, res) => {
    const userId = req.session.usuario.id;
    const resultado = await registrarFichaje(userId);
    return res.status(200).json({ ok: true, ...resultado });
});

// POST /api/auth/descanso
router.post('/descanso', authMiddleware, async (req, res) => {
    const userId = req.session.usuario.id;
    const { motivoId } = req.body;
    const resultado = await registrarPausa(userId, motivoId);
    return res.status(200).json({ ok: true, ...resultado });
});

// GET /api/fichajes/misFichajes
router.get('/misFichajes', authMiddleware, async (req, res) => {
    const userId = req.session.usuario.id;
    const { fechaInicio, fechaFin } = req.query;
    const fichajes = await obtenerFichajesUsuario(userId, fechaInicio, fechaFin);
    return res.status(200).json({ ok: true, ...fichajes });
});

// GET /api/fichajes/estado
router.get('/estado', authMiddleware, async (req, res) => {
    const userId = req.session.usuario.id;
    const estado = await obtenerEstado(userId);
    return res.status(200).json({ ok: true, ...estado });
});

// GET /api/fichajes/todos (admin)
router.get('/todos', soloAdmin, async (req, res) => {
    const { fechaInicio, fechaFin, userId } = req.query;
    const fichajes = await obtenerTodosFichajes(fechaInicio, fechaFin, userId);
    return res.status(200).json({ ok: true, fichajes });
});

// POST /api/fichajes/alta (admin)
router.post('/alta', soloAdmin, async (req, res) => {
    const { usuarioId, tipo, fechaHora, motivoId, observaciones } = req.body;
    const modificadoPor = req.session.usuario.id
    const idFichaje = await altaFichajeAdmin(usuarioId, tipo, fechaHora, motivoId, observaciones, modificadoPor);
    return res.status(201).json({ ok: true, idFichaje });
});

// PUT /api/fichajes/modificar/:id (admin)
router.put('/modificar/:id', soloAdmin, async (req, res) => {
    const { tipo, fechaHora, motivoId, observaciones } = req.body;
    const modificadoPor = req.session.usuario.id;
    const resultado = await editarFichaje(req.params.id, tipo, fechaHora, motivoId, observaciones, modificadoPor);
    return res.status(200).json(resultado);
});