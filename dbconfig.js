import 'dotenv/config';

const puerto = process.env.PUERTO;
const dbconfig = {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user:process.env.PGUSER,
    password:process.env.PGPASSWORD,
    port:5432,
    ssl:true
}

export default dbconfig; 