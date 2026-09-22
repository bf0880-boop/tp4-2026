import client from '../db.js'
import { CANCIONES_PARA_SER_FAN } from '../config.js'

export async function getEscuchoByUser(user_id) {
    return await pool.query("select c.id, c.nombre, e.reproducciones from escucha e inner join cancion c on e.cancion_id = c.id where usuario_id = $1",[user_id])
}

export async function getEscuchoCountByUser(user_id) {
    return await pool.query("select sum(reproducciones) as cantidad from escucha where usuario_id = $1",[user_id])
}

export async function escuchar(usuarioId, cancionId) {
    const cancion = await client.query(
        "SELECT * FROM cancion WHERE id = $1",
        [cancionId]
    );

    if (cancion.rows.length === 0) {
        return { error: "La canción no existe", status: 404 };
    }

    const existente = await client.query(
        "SELECT * FROM escucha WHERE usuario_id = $1 AND cancion_id = $2",
        [usuarioId, cancionId]
    );

    if (existente.rows.length === 0) {
        await client.query(
            "INSERT INTO escucha(usuario_id, cancion_id, reproducciones) VALUES ($1, $2, 1)",
            [usuarioId, cancionId]
        );
    } else {
        await client.query(
            "UPDATE escucha SET reproducciones = reproducciones + 1 WHERE usuario_id = $1 AND cancion_id = $2",
            [usuarioId, cancionId]
        );
    }

    const fan = await actualizarFan(usuarioId);

    const escuchas = await client.query(
        `SELECT cancion.nombre, escucha.reproducciones
         FROM escucha
         JOIN cancion ON cancion.id = escucha.cancion_id
         WHERE escucha.usuario_id = $1`,
        [usuarioId]
    );

    return { fan, escuchas: escuchas.rows };
}

async function actualizarFan(usuarioId) {
    const contadas = await client.query(
        "SELECT COUNT(DISTINCT cancion_id) AS cantidad FROM escucha WHERE usuario_id = $1",
        [usuarioId]
    );

    const cantidad = Number(contadas.rows[0].cantidad);

    if (cantidad > CANCIONES_PARA_SER_FAN) {
        await client.query(
            "UPDATE usuario SET fan = true WHERE id = $1 AND fan = false",
            [usuarioId]
        );

        return true;
    }

    return false;
}
