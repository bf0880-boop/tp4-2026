import pkg from 'pg'
import dbconfig from './dbconfig.js'
import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const {Client} = pkg;
const client = new Client(dbconfig)
await client.connect()

const app = express()
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'

app.post('/crearusuario', async (req, res) => {
    const {userid, nombre, password} = req.body
    const hash = await bcrypt.hash(password, 10)
    await client.query("INSERT INTO usuario (id, nombre, password) VALUES ($1, $2, $3)", [userid, nombre, hash])
    res.send("Usuario creado")
})

app.post('/login', async (req, res) => {
    const {userid, password} = req.body
    const result = await client.query("SELECT * FROM usuario WHERE id = $1", [userid])
    if (result.rows.length === 0) return res.status(400).send("Usuario no existe")

    const usuario = result.rows[0]
    const coincide = await bcrypt.compare(password, usuario.password)
    if (!coincide) return res.status(400).send("Password incorrecto")

    const token = jwt.sign({userid: usuario.id}, JWT_SECRET)
    res.json({token})
})

app.post('/escucho', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.body.token

    try {
        const payload = jwt.verify(token, JWT_SECRET)
        const result = await client.query(
            `SELECT cancion.nombre, escucha.reproducciones
             FROM escucha
             JOIN cancion ON cancion.id = escucha.cancionid
             WHERE escucha.usuarioid = $1`,
            [payload.userid]
        )
        res.json(result.rows)
    } catch (err) {
        res.status(401).send("Token invalido")
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Local en http://localhost:${PORT}`));

export default app;
