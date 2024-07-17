import PG from "pg";

const Pool = PG.Pool;

const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tm_chat',
    password: 'QwertyWeb123',
    port: 5432,
});

export default connection;