import pkg from 'pg'
import dbconfig from './dbconfig.js'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const { Client } = pkg;
const client = new Client(dbconfig)

await client.connect()

const app = express()
app.use(express.json())
app.use(cors());
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'


app.post('/crearusuario', async (req, res) => {
    const user = req.body;

    if ( !user.nombre || !user.email || !user.password) {
        return res.status(400).json({
            message: "Debe completar todos los campos"
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        user.password = hashedPassword;
        let result = await client.query(
            "INSERT INTO usuario(nombre,email,password) VALUES ($1, $2, $3) RETURNING *",
            [user.nombre, user.email, user.password]
        );

        console.log("Rows creadas:", result.rowCount);

        res.send("Usuario creado");

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})


app.post('/login', async (req, res) => {
    const user = req.body;

    if (!user.email || !user.password) {
        return res.status(400).json({
            message: "Debe completar todos los campos"
        });
    }

    try {
        let result = await client.query(
            "select * from usuario where email=$1",
            [user.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        let dbUser = result.rows[0];

        const passOK = await bcrypt.compare(
            user.password,
            dbUser.password
        );

        if (passOK) {
            const payload = {
            id: dbUser.id
            }
            const token = jwt.sign(payload,JWT_SECRET,{expiresIn:'1h'} )

            res.send({
              token
                
            });
        } else {
            return res.status(401).json({
                message: "Clave inválida"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})


app.post('/escucho', async (req, res) => {
    const token =
        req.headers.authorization?.replace('Bearer ', '') ||
        req.body.token

    const { cancion_id } = req.body;

    try {
        const payload = jwt.verify(token, JWT_SECRET)

        if (!cancion_id) {
            return res.status(400).json({
                message: "Debe indicar cancion_id"
            });
        }

        const existente = await client.query(
            "SELECT * FROM escucha WHERE usuario_id = $1 AND cancion_id = $2",
            [payload.id, cancion_id]
        )

        if (existente.rows.length === 0) {
            await client.query(
                "INSERT INTO escucha(usuario_id, cancion_id, reproducciones) VALUES ($1, $2, 1)",
                [payload.id, cancion_id]
            )
        } else {
            await client.query(
                "UPDATE escucha SET reproducciones = reproducciones + 1 WHERE usuario_id = $1 AND cancion_id = $2",
                [payload.id, cancion_id]
            )
        }

        const result = await client.query(
            `SELECT cancion.nombre, escucha.reproducciones
             FROM escucha
             JOIN cancion ON cancion.id = escucha.cancion_id
             WHERE escucha.usuario_id = $1`,
            [payload.id]
        )

        res.json(result.rows)

    } catch (err) {
        console.log("error", err)
        res.status(401).send("Token invalido")
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(`Local en http://localhost:${PORT}`)
);

export default app;
