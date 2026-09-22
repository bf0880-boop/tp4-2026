import client from '../db.js'

export async function getCancionById(id) {
    return await pool.query("select * from cancion where id = $1",[id])
}

export async function getCanciones(id) {
    return await pool.query("select * from cancion",[id])
}

export async function crearCancion(nombre) {
    const result = await client.query(
        "INSERT INTO cancion(nombre) VALUES ($1) RETURNING *",
        [nombre]
    );

    return result.rows[0];
}

export async function modificarCancion(id, nombre) {
    const result = await client.query(
        "UPDATE cancion SET nombre = $1 WHERE id = $2 RETURNING *",
        [nombre, id]
    );

    return result.rows[0];
}

export async function borrarCancion(id) {
    await client.query(
        "DELETE FROM escucha WHERE cancion_id = $1",
        [id]
    );

    const result = await client.query(
        "DELETE FROM cancion WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];
}
