import express from 'express';
import dotenv from 'dotenv';
import { conectaDB,supabase } from './config/supabase.js';
import AuthRoutes from './routes/auth.js';
import UserRoutes from './routes/user.js';


//cargar variables de entorno
dotenv.config();
conectaDB();

//creamos la aplicación express
const app = express();

//leer el json 
app.use(express.json());

//creemos la ruta
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Bienvenido al backend de mimos',
        estado: "en linea",
        version: "1.0.0"
    });
});

//creamos la ruta de usuario
app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);


//configuramos el puerto
const PORT = 3000;

//poner a escuchar el servidor
app.listen(PORT, () => {
    console.log(`✅Servidor escuchando el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});