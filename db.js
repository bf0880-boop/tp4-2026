import pkg from 'pg'
import dbconfig from './dbconfig.js'

const { Client } = pkg;
const client = new Client(dbconfig)

await client.connect()

export default client;
