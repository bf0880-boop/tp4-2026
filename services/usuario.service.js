import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import client from '../db.js'
import { JWT_SECRET, ROL_USUARIO } from '../config.js'

export async function crearUsuario({ nombre, email, password, rol = ROL_USUARIO }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
        "INSERT INTO usuario(nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, fan",
        [nombre, email, hashedPassword, rol]
    );

    return result.rows[0];
}

export async function buscarPorEmail(email) {
    const result = await client.query(
        "SELECT * FROM usuario WHERE email = $1",
        [email]
    );

    return result.rows[0];
}

export async function login(email, password) {
    const dbUser = await buscarPorEmail(email);

    if (!dbUser) {
        return { error: "Usuario no encontrado", status: 404 };
    }

    const passOK = await bcrypt.compare(password, dbUser.password);

    if (!passOK) {
        return { error: "Clave inválida", status: 401 };
    }

    const payload = {
        id: dbUser.id,
        email: dbUser.email,
        rol: dbUser.rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    return { token };
}
