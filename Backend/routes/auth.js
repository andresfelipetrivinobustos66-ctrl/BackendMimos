import express from 'express';
import { registro, login } from '../controllers/Auth.js';
import { forgotPassword } from '../controllers/recuperar.js';

const router = express.Router();

//rutas de autenticacion
router.post('/register', registro);
router.post('/login', login);

//ruta de olvido de contraseña
router.post('/forgot-password', forgotPassword);

export default router;