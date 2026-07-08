import bcrypt from 'bcrypt';
import { 
    obtenerUsuarios, 
    obtenerPorId, 
    actualizarUsuario,
    eliminarUsuario
} from '../models/usuarios.js';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const { data, error } = await obtenerUsuarios();
        if (error) return res.status(500).json({ error: 'Error obteniendo usuarios' });
        
        return res.status(200).json({ usuarios: data });
    } catch (error) {
        console.error('Error al obtener usuarios', error);
        return res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener usuario por ID
export const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await obtenerPorId(id);

        if (error || !data) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json({ usuario: data });
    } catch (error) {
        console.error('Error al obtener usuario', error);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Actualizar usuario 
export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    try {
        let datosActualizar = {};

        if (nombre !== undefined) datosActualizar.nombre = nombre;
        if (email !== undefined) datosActualizar.email = email;
        if (rol !== undefined) datosActualizar.rol = rol;

        // Encriptar contraseña solo si viene
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            datosActualizar.password = hashedPassword;
        }

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
        }

        const { data, error } = await actualizarUsuario(id, datosActualizar);

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { password: _, ...usuarioActualizado } = data[0];

        return res.status(200).json({
            message: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await eliminarUsuario(id);
        if (error) {
            return res.status(500).json({ 
                error: 'Error al eliminar el usuario', error: error.message 
            });
        }
        //si el dato no tiene datos vacios
        if (!data || data.length === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado' 
            });
        }
        return res.status(200).json({ 
            message: 'Usuario eliminado correctamente',
            usuario: data[0]
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ 
            error: 'Error al eliminar el usuario' 
        });
    }
};
