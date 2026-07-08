//importamos la base de datos
import { supabase } from '../config/supabase.js';

//funcion para crear todos los usuarios
export const crearUsuario = async ({ nombre, email, password, rol }) => {
    const { data, error } = await supabase
    .from('usuarios')
    .insert({nombre, email, password, rol: rol || 'usuario'})
    .select('id, nombre, email, rol');
    return { data, error };

};

//obtener todos los usuarios
export const obtenerUsuarios = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol');
    return { data, error };
};

//buscar el usuario por email para login
export const obtenerPorEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, password, rol')
        .eq('email', email)
        .single();
    return { data, error };
};

//buscar el usuario por id
export const obtenerPorId = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol')
        .eq('id', id)
        .single();
    return { data, error };
};

//actualizar un usuario
export const actualizarUsuario = async (id, campos) => {
    const { data, error } = await supabase
        .from('usuarios')
        .update(campos)
        .eq('id', id)
        .select('id, nombre, email, password, rol');

        return { data, error };
};

//eliminar un usuario
export const eliminarUsuario = async (id) => {
    const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)
        .select('id, nombre, email, rol');
    return { data, error };
};