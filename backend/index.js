// TODO: Configurar Express
//   Importar express, cors, express-session
//   Configurar CORS para permitir peticiones desde React (localhost:5173)
//   Configurar express.json() para leer el body de las peticiones
//
// TODO: Registrar rutas
//   app.use('/api/auth',      authRoutes)
//   app.use('/api/fichajes',  fichajesRoutes)
//   app.use('/api/informes',  informesRoutes)
//   app.use('/api/ausencias', ausenciasRoutes)
//
// TODO: Arrancar servidor
//   app.listen(PORT) en puerto 3000

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import fichajesRoutes from './routes/fichajes.js';
import informesRouter from './routes/informes.js';
import usuariosRouter from './routes/usuarios.js';
import ausenciasRouter from './routes/ausencias.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({
  origin: [
  'http://localhost:5173', //Puerto que usa Vite por defecto al hacer npm run dev.
  'http://localhost:4173'  //Puerto para la PWA
],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'app_fichajes',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

//Rutas
app.use('/api/auth', authRoutes);
app.use('/api/fichajes', fichajesRoutes);
app.use('/api/informes', informesRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/ausencias', ausenciasRouter);

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});