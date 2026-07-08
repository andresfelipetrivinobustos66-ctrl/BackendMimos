import {crearCodigoRecuperacion} from "../models/recuperar.js";
import { obtenerPorEmail } from "../models/usuarios.js";
import nodemailer from "nodemailer";

//configuramos el transporte de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//configurar la logica para enviar el correo de recuperacion
export const forgotPassword= async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }
        //verificar si el usuario existe
        const { data: usuario, error: errorUsuario } = await obtenerPorEmail(email);
        if (errorUsuario || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //generar un codigo de recuperacion
        const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Codigo de 6 digitos

        //guardar el codigo en la base de datos

        const {error:errorCodigo}=await crearCodigoRecuperacion(usuario.id,codigo);

        if(errorCodigo){
            return res.status(500).json({ error: 'Error al generar el código de recuperación' });
        }

        //creamos el email del codigo

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Tu código de recuperación es: ${codigo}`,
            html: `
            <h2>Recuperacion de contraseña</h2>
            <p>Hola ${usuario.nombre || 'usuario'},</p>
            <p>Tu código de recuperación es: ${codigo}</p>
            <h1 style="color: #39a900; font-size: 36px;">${codigo}</h1>
            <p> Este codigo es válido por 15 minutos. Si no solicitaste este código, por favor ignora este correo.</p>
            <p>Gracias,</p>
            <p>El equipo de soporte</p>
            <p> No compartas este codigo con nadie</p>
            `
        });

        return res.status(200).json({ message: 'Código de recuperación enviado al correo' });

    }catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ error: 'Error al enviar el codigo de recuperación' });

    }
} 
