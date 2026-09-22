import pkg from 'pg'
import dbconfig from './dbconfig.js'

const { Pool } = pkg;
const pool = new Pool(dbconfig)

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de PostgreSQL', err)
})

export default pool;
