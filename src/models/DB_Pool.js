const mysql = require('mysql2/promise');
require('dotenv').config();

// 환경변수
const host = process.env.HOST;
const db_port = process.env.DB_PORT;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pwd = process.env.DB_PWD;

const pool = mysql.createPool({
    host: host,
    port: db_port,
    user: db_user,
    password: db_pwd,
    database: db_name,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
});

module.exports = pool;
