import mysql from 'mysql2/promise.js';

import config from './config.js';

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
});

export default pool;
