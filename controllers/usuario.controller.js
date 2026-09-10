import * as usuarioService from '../services/usuario.service.js'
import { ROL_ADMIN, ROL_USUARIO } from '../config.js'

export async function crearUsuario(req, res) {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({
            message: "Debe completar todos los campos"
        });
    }

    if (rol && rol !== ROL_ADMIN && rol !== ROL_USUARIO) {
        return res.status(400).json({
            message: "El rol debe ser 'A' o 'U'"
        });
    }

    try {
        const usuario = await usuarioService.crearUsuario({ nombre, email, password, rol });

        res.status(201).json({
            message: "Usuario creado",
            usuario
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Debe completar todos los campos"
        });
    }

    try {
        const resultado = await usuarioService.login(email, password);

        if (resultado.error) {
            return res.status(resultado.status).json({
                message: resultado.error
            });
        }

        res.json({ token: resultado.token });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
