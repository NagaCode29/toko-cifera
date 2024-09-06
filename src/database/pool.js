import mysql from 'mysql2/promise.js';

import config from './config.js';

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
    port: config.port,
    password : config.password,
    timezone:"+07:00"
});

export default pool;
