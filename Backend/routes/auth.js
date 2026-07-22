import express from 'express';
import { registro, login } from '../controllers/Auth.js';
import { forgotPassword, verifyCode  } from '../controllers/recuperar.js';

const router = express.Router();

//rutas de autenticacion
router.post('/register', registro);
router.post('/login', login);

//ruta de olvido de contraseña
router.post('/forgot-password', forgotPassword);

//ruta para verificar el codigo de recuperacion y cambiar contraseña
router.post('/verify-code', verifyCode);

export default router;