import pkg from 'pg';
import {config} from 'dotenv';

config();
const {Pool} = pkg


const db = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

try {
    db.on("connect", ()=>{
    console.log("✅ Database Connecttion Established.")
})
} catch (err) {
    console.log(err)
}


export default db